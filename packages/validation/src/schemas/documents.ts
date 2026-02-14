import * as z from "zod/v4";

export const documentInSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name must be less than 255 characters"),
  date: z.coerce.date<Date>().optional(),
  mileage: z.coerce.number().int().optional(),
  file: z.custom<File | undefined>().refine((file) => file != null, "A file is required"),
  note: z.string().optional(),
  typeId: z.coerce.number().int().min(1),
});

export const documentOutSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  date: z.iso.datetime().nullable(),
  mileage: z.number().int().nullable(),
  uri: z.string().nullable(),
  note: z.string().nullable(),
  type: z.object({ name: z.string().nullable() }).nullable(),
});

export const createDocumentSchema = documentInSchema;

export const updateDocumentSchema = documentInSchema.partial();

export const getDocumentSchema = documentOutSchema;

export const listDocumentsSchema = z.array(documentOutSchema);
