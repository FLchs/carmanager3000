import { documents } from "#db/schemas/documents";
import { operations } from "#db/schemas/operations";
import { relations } from "#db/schemas/relations";
import { vehicles } from "#db/schemas/vehicle";
import * as fileUtils from "#utils/files";
import { rootDir } from "#utils/paths";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { reset, seed } from "drizzle-seed";
import { ok } from "true-myth/result";
import { beforeAll, beforeEach, describe, expect, it, Mocked, vi } from "vitest";

import {
  createDocument,
  getDocument,
  listDocuments,
  removeDocument,
  updateDocument,
} from "./service";

vi.mock("#db/index", () => {
  const rawDb = drizzle({
    connection: { url: ":memory:" },
    relations: relations,
  });
  const migrateDb = async () => {
    await migrate(rawDb, { migrationsFolder: `${rootDir}/migrations` });
  };

  return { db: rawDb, migrateDb };
});

describe("Documents service test", () => {
  let dbModule: Awaited<typeof import("#db/index")>;
  let spy: Mocked<typeof fileUtils.saveFile>;
  beforeAll(async () => {
    dbModule = await import("#db/index");
    await dbModule.migrateDb();
    spy = vi
      .spyOn(fileUtils, "saveFile")
      .mockResolvedValue(ok("/uploads/test.pdf") as Awaited<ReturnType<typeof fileUtils.saveFile>>);
  });

  beforeEach(async () => {
    await reset(dbModule.db, { vehicles, operations });
    await dbModule.db.delete(documents);
  });

  describe("listDocuments", () => {
    it("returns empty array if database is empty", async () => {
      const result = await listDocuments();
      expect(result.isOk).toBe(true);
      if (result.isOk) {
        expect(result.value).toEqual([]);
      }
    });

    it("returns all documents when no entityId is provided", async () => {
      await seed(dbModule.db, { vehicles }, { count: 2 });

      // Manually create documents
      for (let i = 0; i < 6; i++) {
        await dbModule.db.insert(documents).values({
          name: "Test Document",
          typeId: 1,
          entityType: "vehicle",
          entityId: 1,
          deleted: false,
        });
      }

      const result = await listDocuments();
      expect(result.isOk).toBe(true);
      if (result.isOk) {
        expect(result.value).toHaveLength(6);
      }
    });

    it("returns documents for a specific vehicle", async () => {
      await seed(dbModule.db, { vehicles }, { count: 2 });

      // Manually create documents for vehicle 1
      for (let i = 0; i < 6; i++) {
        await dbModule.db.insert(documents).values({
          name: "Test Document",
          typeId: 1,
          entityType: "vehicle",
          entityId: 1,
          deleted: false,
        });
      }

      const result = await listDocuments(1, "vehicle");
      expect(result.isOk).toBe(true);
      if (result.isOk) {
        expect(result.value).toHaveLength(6);
        expect(result.value.every((doc) => doc.id !== undefined)).toBe(true);
      }
    });
  });

  describe("getDocument", () => {
    it("returns a document by id", async () => {
      await seed(dbModule.db, { vehicles }, { count: 1 });

      // Manually create a document and capture its ID
      const [{ id: documentId }] = await dbModule.db
        .insert(documents)
        .values({
          name: "Test Document",
          typeId: 1,
          entityType: "vehicle",
          entityId: 1,
        })
        .returning({ id: documents.id });

      const result = await getDocument(documentId);
      expect(result.isOk).toBe(true);
      if (result.isOk) {
        expect(result.value).toBeDefined();
        expect(result.value.id).toBe(documentId);
      }
    });

    it("returns error if document not found", async () => {
      const result = await getDocument(999);
      expect(result.isErr).toBe(true);
    });
  });

  describe("createDocument", () => {
    it("creates a document", async () => {
      await seed(dbModule.db, { vehicles }, { count: 1 });
      const file = new File([], "testfile.pdf");
      const result = await createDocument({
        name: "Test Document",
        date: new Date(),
        mileage: 50000,
        note: "Insurance document",
        typeId: 1,
        file,
        entityId: 1,
        entityType: "vehicle",
      });
      expect(result.isOk).toBe(true);
      expect(spy).toHaveBeenCalledWith(file);
      const documentsList = await dbModule.db.query.documents.findMany();
      expect(documentsList).toHaveLength(1);
    });

    it("does not create a document if required fields are missing", async () => {
      // @ts-expect-error missing property on purpose
      const result = await createDocument({
        date: new Date(),
        mileage: 50000,
        note: "Insurance document",
        file: new File([], "testfile.pdf"),
      });
      expect(result.isErr).toBe(true);
    });
  });

  describe("updateDocument", () => {
    it("updates a document", async () => {
      await seed(dbModule.db, { vehicles }, { count: 1 });

      // Manually create a document and capture its ID
      const [{ id: documentId }] = await dbModule.db
        .insert(documents)
        .values({
          name: "Test Document",
          typeId: 1,
          entityType: "vehicle",
          entityId: 1,
        })
        .returning({ id: documents.id });

      const result = await updateDocument(documentId, {
        note: "Updated note",
        // uri: "https://example.com/updated.pdf",
      });
      expect(result.isOk).toBe(true);
      const updatedDocument = await dbModule.db.query.documents.findFirst({
        where: { id: documentId },
      });
      expect(updatedDocument?.note).toStrictEqual("Updated note");
      // expect(updatedDocument?.uri).toStrictEqual("https://example.com/updated.pdf");
    });

    it.todo("returns the correct error type if not found");
  });

  describe("removeDocument", () => {
    it("removes a document", async () => {
      await seed(dbModule.db, { vehicles }, { count: 1 });

      // Manually create documents and capture first ID
      const [{ id: documentId }] = await dbModule.db
        .insert(documents)
        .values({
          name: "Test Document",
          typeId: 1,
          entityType: "vehicle",
          entityId: 1,
          deleted: false,
        })
        .returning({ id: documents.id });

      for (let i = 0; i < 2; i++) {
        await dbModule.db.insert(documents).values({
          name: "Test Document",
          typeId: 1,
          entityType: "vehicle",
          entityId: 1,
          deleted: false,
        });
      }

      const removeResult = await removeDocument(documentId);
      expect(removeResult.isOk).toBe(true);
      const result = await listDocuments();
      expect(result.isOk).toBe(true);
      if (result.isOk) {
        expect(result.value).toHaveLength(2);
      }
    });

    it.todo("returns the correct error type if not found");
  });
});
