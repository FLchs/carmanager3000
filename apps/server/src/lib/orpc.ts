import { os } from "@orpc/server";
import * as z from "zod/v4";

export default os.errors({
  INPUT_VALIDATION_FAILED: {
    status: 422,
    data: z.object({
      fieldErrors: z.record(z.string(), z.array(z.string()).optional()),
      formErrors: z.array(z.string()),
    }),
  },
});
