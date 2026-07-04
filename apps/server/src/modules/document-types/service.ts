import { db } from "#db/index";
import { documentsTypes } from "#db/schemas/documentTypes";
import { DbError } from "#lib/serviceErrors";
import { createDocumentTypeSchema } from "@cm3k/validation";
import { ok, err } from "true-myth/result";
import * as z from "zod/v4";

export const listDocumentTypes = async () => {
  try {
    const documentTypesList = await db.query.documentsTypes.findMany({
      columns: {
        id: true,
        name: true,
      },
    });
    return ok(documentTypesList);
  } catch (error) {
    return err(new DbError(error));
  }
};

export const createDocumentType = async (input: z.infer<typeof createDocumentTypeSchema>) => {
  try {
    const { name, slug } = input;

    const [documentType] = await db
      .insert(documentsTypes)
      .values({ name, slug })
      .returning({ id: documentsTypes.id, name: documentsTypes.name, slug: documentsTypes.slug });
    return ok(documentType);
  } catch (error) {
    return err(new DbError(error));
  }
};
