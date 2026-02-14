import * as z from "zod/v4";

export const deleteInputSchema = z.object({
  id: z.coerce.number().int(),
});

export const deleteOutputSchema = z.void();
