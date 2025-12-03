import { operations } from "#db/schemas/operations";
import { relations } from "#db/schemas/relations";
import { vehicles } from "#db/schemas/vehicle";
import { rootDir } from "#utils/paths";
import { getVehicleSchema, listVehiclesSchema } from "@cm3k/validation";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { reset, seed } from "drizzle-seed";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { getVehicle, listVehicle } from "./service";

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

describe("Vehicles service test", () => {
  let dbModule: Awaited<typeof import("#db/index")>;

  beforeAll(async () => {
    dbModule = await import("#db/index");
    await dbModule.migrateDb();
  });

  beforeEach(async () => {
    await reset(dbModule.db, { operations, vehicles });
  });

  describe("list", () => {
    it("returns empty array if database is empty", async () => {
      const vehiclesList = await listVehicle();
      expect(vehiclesList).toEqual([]);
    });

    it("returns validated vehicles", async () => {
      await seed(dbModule.db, { vehicles }, { count: 2 });
      const result = await listVehicle();
      expect(result).toHaveLength(2);
      expect(listVehiclesSchema.safeParse(result).error).toBeUndefined();
    });
  });

  describe("get", async () => {
    it("returns a vehicle with operations", async () => {
      await seed(dbModule.db, { operations, vehicles }).refine(() => ({
        vehicles: {
          columns: {},
          count: 1,
          with: {
            operations: 10,
          },
        },
      }));
      const result = await getVehicle(1);
      expect(result.operations.length).toEqual(10);
      expect(getVehicleSchema.safeParse(result).error).toBeUndefined();
    });

    it("returns a vehicle without operations", async () => {
      await seed(dbModule.db, { vehicles }).refine(() => ({
        vehicles: {
          columns: {},
          count: 1,
        },
      }));
      const result = await getVehicle(1);
      expect(result.operations.length).toEqual(0);
      expect(getVehicleSchema.safeParse(result).error).toBeUndefined();
    });

    it.todo("returns the correct error type if not found");
  });
});
