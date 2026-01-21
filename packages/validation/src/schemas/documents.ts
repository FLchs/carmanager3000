import * as z from "zod/v4";

export const documentInSchema = z.object({
  date: z.coerce.date<Date>(),
  mileage: z.coerce.number<number>().int().nullable(),
  file: z.file(),
  // uri: z.url().nullable(),
  note: z.string().nullable(),
  type: z.enum(["cover"]),
});

export const documentOutSchema = z.object({
  id: z.number().int(),
  date: z.date().nullable(),
  mileage: z.number().int().nullable(),
  uri: z.string().nullable(),
  note: z.string().nullable(),
  type: z.enum(["cover"]),
});

export const createDocumentSchema = documentInSchema;

export const updateDocumentSchema = documentInSchema.partial();

export const getDocumentSchema = documentOutSchema;

export const listDocumentsSchema = z.array(documentOutSchema);
