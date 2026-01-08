import { type ErrorMap } from "@orpc/contract";
import * as z from "zod/v4";

export const errors = {
  INPUT_VALIDATION_FAILED: {
    status: 422,
    data: z.object({
      fieldErrors: z.record(z.string(), z.string().optional().or(z.array(z.string().optional()))),
      formErrors: z.array(z.string()),
    }),
  },
  NOT_FOUND: {
    status: 404,
  },
  SKILL_ISSUE: {
    status: 418,
    data: z.object({
      message: z.string(),
    }),
  },
} satisfies ErrorMap;
