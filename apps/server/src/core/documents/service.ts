import { db } from "#db/index";
import { documents } from "#db/schemas/documents";
import { DbError, NotFoundError } from "#lib/serviceErrors";
import { saveFile } from "#utils/files";
import { createDocumentSchema, updateDocumentSchema } from "@cm3k/validation";
import { eq } from "drizzle-orm";
import { ok, err } from "true-myth/result";
import * as z from "zod/v4";

const createDocumentServiceSchema = createDocumentSchema.extend({
  entityId: z.number().int(),
  entityType: z.enum(["vehicle", "operation"]),
});

const toIsoString = (value: Date | null | undefined) => (value ? value.toISOString() : null);

export const listDocuments = async (entityId?: number, entityType?: "vehicle" | "operation") => {
  try {
    const documentsList = await db.query.documents.findMany({
      where: { entityId, entityType, deleted: false },
      with: {
        type: {
          columns: {
            name: true,
          },
        },
      },
      columns: {
        id: true,
        name: true,
        date: true,
        mileage: true,
        uri: true,
        note: true,
      },
    });
    return ok(
      documentsList.map((document) => ({
        ...document,
        date: toIsoString(document.date),
      })),
    );
  } catch (error) {
    return err(new DbError(error));
  }
};

export const getDocument = async (id: number) => {
  try {
    const document = await db.query.documents.findFirst({
      where: { id },
      with: {
        type: {
          columns: {
            name: true,
          },
        },
      },
      columns: {
        id: true,
        name: true,
        date: true,
        mileage: true,
        uri: true,
        note: true,
      },
    });
    if (document !== undefined) {
      return ok({
        ...document,
        date: toIsoString(document.date),
      });
    }
    return err(new NotFoundError("Document not found"));
  } catch (eror) {
    return err(new DbError(eror));
  }
};

export const createDocument = async (input: z.infer<typeof createDocumentServiceSchema>) => {
  try {
    const { file, date, ...docs } = input;
    const dbDate = date ? new Date(date) : undefined;

    const result = await saveFile(file);
    if (result.isErr) {
      return err(result.error);
    }

    const [document] = await db
      .insert(documents)
      .values({ ...docs, date: dbDate, uri: result.value })
      .returning({ id: documents.id });
    return ok(document.id);
  } catch (error) {
    return err(new DbError(error));
  }
};

export const updateDocument = async (id: number, input: z.infer<typeof updateDocumentSchema>) => {
  try {
    const { date, ...rest } = input;
    const updateData = {
      ...rest,
      ...(date !== undefined ? { date: new Date(date) } : {}),
    };
    const result = await db
      .update(documents)
      .set(updateData)
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
