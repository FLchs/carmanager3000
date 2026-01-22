import * as z from "zod/v4";

export const documentInSchema = z.object({
  date: z.coerce.date<Date>(),
  mileage: z.coerce.number<number>().int().nullable(),
  file: z.file(),
  note: z.string().nullable(),
  typeId: z.coerce.number<number>().int(),
});

export const documentOutSchema = z.object({
  id: z.number().int(),
  date: z.date().nullable(),
  mileage: z.number().int().nullable(),
  uri: z.string().nullable(),
  note: z.string().nullable(),
  type: z.object({ name: z.string().nullable() }).nullable(),
});

export const createDocumentSchema = documentInSchema;

export const updateDocumentSchema = documentInSchema.partial();

export const getDocumentSchema = documentOutSchema;

export const listDocumentsSchema = z.array(documentOutSchema);
