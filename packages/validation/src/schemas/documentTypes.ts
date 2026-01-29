import * as z from "zod/v4";

export const documentTypeOutSchema = z.object({
  id: z.number().int(),
  name: z.string(),
});

export const listDocumentTypesSchema = z.array(documentTypeOutSchema);
