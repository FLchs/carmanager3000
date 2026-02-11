import * as z from "zod/v4";

export const documentTypeInSchema = z.object({
  name: z.string(),
  slug: z.string(),
});

export const documentTypeOutSchema = z.object({
  id: z.number().int(),
  name: z.string(),
});

export const listDocumentTypesSchema = z.array(documentTypeOutSchema);

export const createDocumentTypeSchema = documentTypeInSchema;

export const getDocumentTypeSchema = documentTypeOutSchema;
