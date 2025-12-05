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
      const operationsList = await listOperations();
      expect(operationsList).toEqual([]);
    });

    it("returns all operations when no vehicleId is provided", async () => {
      await seed(dbModule.db, { operations, vehicles }).refine(() => ({
        vehicles: {
          columns: {},
          count: 2,
          with: {
            operations: 3,
          },
        },
      }));
      const result = await listOperations();
      expect(result).toHaveLength(6);
    });

    it("returns operations for a specific vehicle", async () => {
      await seed(dbModule.db, { operations, vehicles }).refine(() => ({
        vehicles: {
          columns: {},
          count: 2,
          with: {
            operations: 3,
          },
        },
      }));
      const result = await listOperations(1);
      expect(result).toHaveLength(3);
      expect(result.every((op) => op.id !== undefined)).toBe(true);
      result.forEach(async (op) => {
        const dbOp = await dbModule.db.query.operations.findFirst({
          columns: { vehicleId: true },
          where: { id: op.id },
        });
        expect(dbOp?.vehicleId).toBe(1);
      });
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
      expect(result).toBeDefined();
      expect(result?.id).toBe(1);
    });

    it("returns undefined if operation not found", async () => {
      const result = await getOperation(999);
      expect(result).toBeUndefined();
    });
  });

  describe("createOperation", () => {
    it("creates an operation", async () => {
      await seed(dbModule.db, { vehicles }, { count: 1 });
      const result = await createOperation({
        date: new Date("2024-01-15"),
        mileage: 50000,
        note: "Oil change",
        type: "maintenance",
        vehicleId: 1,
      });
      expect(result).toStrictEqual({ ok: true });
      const operationsList = await dbModule.db.query.operations.findMany();
      expect(operationsList).toHaveLength(1);
    });

    it("does not create an operation if vehicleId is missing", async () => {
      await expect(
        // @ts-expect-error missing property on purpose
        createOperation({
          date: new Date("2024-01-15"),
          mileage: 50000,
          note: "Oil change",
          type: "maintenance",
        }),
      ).rejects.toThrow(/Failed query/);
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
        vehicleId: 1,
      });
      expect(result).toStrictEqual({ ok: true });
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
      }));
      await removeOperation(1);
      const result = await listOperations();
      expect(result).toHaveLength(2);
    });

    it.todo("returns the correct error type if not found");
  });
});
