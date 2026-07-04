import { operations } from "#db/schemas/operations";
import { relations } from "#db/schemas/relations";
import { vehicles } from "#db/schemas/vehicle";
import { rootDir } from "#utils/paths";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { reset, seed } from "drizzle-seed";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import {
  createOperation,
  getOperation,
  listOperations,
  removeOperation,
  updateOperation,
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

describe("Operations service test", () => {
  let dbModule: Awaited<typeof import("#db/index")>;

  beforeAll(async () => {
    dbModule = await import("#db/index");
    await dbModule.migrateDb();
  });

  beforeEach(async () => {
    await reset(dbModule.db, { operations, vehicles });
  });

  describe("listOperations", () => {
    it("returns empty array if database is empty", async () => {
      const result = await listOperations();
      expect(result.isOk).toBe(true);
      if (result.isOk) {
        expect(result.value).toEqual([]);
      }
    });

    it("returns all operations when no vehicleId is provided", async () => {
      await seed(dbModule.db, { operations, vehicles }).refine(() => ({
        vehicles: {
          count: 2,
          with: {
            operations: 3,
          },
        },
        operations: {
          columns: {
            deleted: false,
          },
        },
      }));
      const result = await listOperations();
      expect(result.isOk).toBe(true);
      if (result.isOk) {
        expect(result.value).toHaveLength(6);
      }
    });

    it("returns operations for a specific vehicle", async () => {
      await seed(dbModule.db, { operations, vehicles }).refine(() => ({
        vehicles: {
          columns: { deleted: false },
          count: 2,
          with: {
            operations: 3,
          },
        },
        operations: {
          columns: {
            deleted: false,
          },
        },
      }));
      const result = await listOperations(1);
      expect(result.isOk).toBe(true);
      if (result.isOk) {
        expect(result.value).toHaveLength(3);
        expect(result.value.every((op) => op.id !== undefined)).toBe(true);
        result.value.forEach(async (op) => {
          const dbOp = await dbModule.db.query.operations.findFirst({
            columns: { vehicleId: true },
            where: { id: op.id },
          });
          expect(dbOp?.vehicleId).toBe(1);
        });
      }
    });
  });

  describe("getOperation", () => {
    it("returns an operation by id", async () => {
      await seed(dbModule.db, { operations, vehicles }).refine(() => ({
        vehicles: {
          columns: {},
          count: 1,
          with: {
            operations: 5,
          },
        },
      }));
      const result = await getOperation(1);
      expect(result.isOk).toBe(true);
      if (result.isOk) {
        expect(result.value).toBeDefined();
        expect(result.value.id).toBe(1);
      }
    });

    it("returns error if operation not found", async () => {
      const result = await getOperation(999);
      expect(result.isErr).toBe(true);
    });
  });

  describe("createOperation", () => {
    it("creates an operation", async () => {
      await seed(dbModule.db, { vehicles }, { count: 1 });
      const result = await createOperation(1, {
        name: "Oil change",
        date: "2024-01-15T00:00:00.000Z",
        mileage: 50000,
        note: "Oil change",
        type: "maintenance",
      });
      expect(result.isOk).toBe(true);
      const operationsList = await dbModule.db.query.operations.findMany();
      expect(operationsList).toHaveLength(1);
    });

    it("does not create an operation if vehicleId is missing", async () => {
      // @ts-expect-error missing property on purpose
      const result = await createOperation({
        name: "Oil change",
        date: "2024-01-15T00:00:00.000Z",
        mileage: 50000,
        note: "Oil change",
        type: "maintenance",
      });
      expect(result.isErr).toBe(true);
    });
  });

  describe("updateOperation", () => {
    it("updates an operation", async () => {
      await seed(dbModule.db, { operations, vehicles }).refine(() => ({
        vehicles: {
          columns: {},
          count: 1,
          with: {
            operations: 1,
          },
        },
      }));
      const result = await updateOperation(1, {
        note: "Updated note",
        type: "repair",
      });
      expect(result.isOk).toBe(true);
      const updatedOperation = await dbModule.db.query.operations.findFirst({
        where: { id: 1 },
      });
      expect(updatedOperation?.note).toStrictEqual("Updated note");
      expect(updatedOperation?.type).toStrictEqual("repair");
    });

    it.todo("returns the correct error type if not found");
  });

  describe("removeOperation", () => {
    it("removes an operation", async () => {
      await seed(dbModule.db, { operations, vehicles }).refine(() => ({
        vehicles: {
          columns: {},
          count: 1,
          with: {
            operations: 3,
          },
        },
        operations: {
          columns: {
            deleted: false,
          },
        },
      }));
      const removeResult = await removeOperation(1);
      expect(removeResult.isOk).toBe(true);
      const result = await listOperations();
      expect(result.isOk).toBe(true);
      if (result.isOk) {
        expect(result.value).toHaveLength(2);
      }
    });

    it.todo("returns the correct error type if not found");
  });
});
