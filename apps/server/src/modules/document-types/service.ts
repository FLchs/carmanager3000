import { db } from "#db/index";
import { DbError } from "#lib/serviceErrors";
import { ok, err } from "true-myth/result";

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
