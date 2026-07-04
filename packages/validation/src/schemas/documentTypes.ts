import * as z from "zod/v4";

export const documentTypeInSchema = z.object({
  name: z.string(),
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9]+(?:_[a-z0-9]+)*$/, {
      message:
        "Slug must contain only lowercase letters, numbers, and single underscores between words",
    }),
});

export const documentTypeOutSchema = z.object({
  id: z.number().int(),
  name: z.string(),
});

export const listDocumentTypesSchema = z.array(documentTypeOutSchema);

export const createDocumentTypeSchema = documentTypeInSchema;

export const getDocumentTypeSchema = documentTypeOutSchema;
