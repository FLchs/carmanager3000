import { NotFoundError, ServiceError } from "#lib/serviceErrors";
import { logger } from "#utils/logger";
import { errors } from "@cm3k/contract";
import { ORPCError, os, ValidationError } from "@orpc/server";
import { z } from "zod/v4";

export const errorMiddleware = os
  .errors(errors)
  .middleware(async ({ next, errors, procedure }, input) => {
    try {
      return await next();
    } catch (error) {
      logger.error({
        err: error,
        route: procedure["~orpc"].route,
        input,
      });

      if (error instanceof ServiceError) {
        if (error instanceof NotFoundError) {
          throw errors.NOT_FOUND({ message: error.message });
        }
      }

      if (error instanceof ORPCError) {
        if (error.cause instanceof ValidationError) {
          const issues = error.cause.issues as z.core.$ZodIssue[];

          // when the input of a handler has a inputStructure: "detailed" validation errors are buried inside "body".
          // So we pre=flatten the issues to prevent losing information.
          const mappedError = new z.ZodError(
            issues.map((issue) => {
              // If path starts with "body", strip it off to get the form path
              // e.g. ["body", "user", "name"] -> ["user", "name"]
              const cleanedPath =
                issue.path.length > 0 && issue.path[0] === "body"
                  ? issue.path.slice(1)
                  : issue.path;

              return {
                ...issue,
                path: cleanedPath,
              };
            }),
          );

          throw errors.INPUT_VALIDATION_FAILED({
            message: z.prettifyError(error.cause),
            data: z.flattenError(mappedError),
            cause: error.cause,
          });
        }
        throw error;
      }

      throw new ORPCError("INTERNAL_SERVER_ERROR", { message: "Unknow error" });
    }
  });
