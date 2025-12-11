import { onError, ORPCError, ValidationError } from "@orpc/server";
import * as z from "zod/v4";

export const validationErrorInterceptor = (err: unknown) => {
  if (
    !(err instanceof ORPCError) ||
    err.code !== "BAD_REQUEST" ||
    !(err.cause instanceof ValidationError)
  )
    return;

  const issues = err.cause.issues as z.core.$ZodIssue[];

  // when the input of a handler has a inputStructure: "detailed" validation errors are buried inside "body".
  // So we pre=flatten the issues to prevent losing information.
  const mappedError = new z.ZodError(
    issues.map((issue) => {
      // If path starts with "body", strip it off to get the form path
      // e.g. ["body", "user", "name"] -> ["user", "name"]
      const cleanedPath =
        issue.path.length > 0 && issue.path[0] === "body" ? issue.path.slice(1) : issue.path;

      return {
        ...issue,
        path: cleanedPath,
      };
    }),
  );

  throw new ORPCError("INPUT_VALIDATION_FAILED", {
    status: 422,
    message: z.prettifyError(err.cause),
    data: z.flattenError(mappedError),
    cause: err.cause,
  });
};
