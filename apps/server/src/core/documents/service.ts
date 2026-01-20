import { db } from "#db/index";
import { documents } from "#db/schemas/documents";
import { DbError, NotFoundError } from "#lib/serviceErrors";
import { createDocumentSchema, updateDocumentSchema } from "@cm3k/validation";
import { eq } from "drizzle-orm";
import { ok, err } from "true-myth/result";
import * as z from "zod/v4";

const createDocumentServiceSchema = createDocumentSchema.extend({
  entityId: z.number().int(),
  entityType: z.enum(["vehicle", "operation"]),
});

export const listDocuments = async (entityId?: number, entityType?: "vehicle" | "operation") => {
  try {
    const documentsList = await db.query.documents.findMany({
      where: { entityId, entityType, deleted: false },
      columns: {
        id: true,
        date: true,
        mileage: true,
        uri: true,
        note: true,
        type: true,
      },
    });
    return ok(documentsList);
  } catch (error) {
    return err(new DbError(error));
  }
};

export const getDocument = async (id: number) => {
  try {
    const document = await db.query.documents.findFirst({
      where: { id },
      columns: {
        id: true,
        date: true,
        mileage: true,
        uri: true,
        note: true,
        type: true,
      },
    });
    if (document !== undefined) {
      return ok(document);
    }
    return err(new NotFoundError("Document not found"));
  } catch (eror) {
    return err(new DbError(eror));
  }
};

export const createDocument = async (input: z.infer<typeof createDocumentServiceSchema>) => {
  try {
    const [document] = await db.insert(documents).values(input).returning({ id: documents.id });
    return ok(document.id);
  } catch (error) {
    return err(new DbError(error));
  }
};

export const updateDocument = async (id: number, input: z.infer<typeof updateDocumentSchema>) => {
  try {
    const result = await db.update(documents).set(input).where(eq(documents.id, id)).returning();
    if (result.length === 0) {
      return err(new NotFoundError("Document not found"));
    }
    return ok();
  } catch (error) {
    return err(new DbError(error));
  }
};

export const removeDocument = async (id: number) => {
  try {
    const result = await db
      .update(documents)
      .set({ deleted: true })
      .where(eq(documents.id, id))
      .returning();
    if (result.length === 0) {
      return err(new NotFoundError("Document not found"));
    }
    return ok();
  } catch (error) {
    return err(new DbError(error));
  }
};
