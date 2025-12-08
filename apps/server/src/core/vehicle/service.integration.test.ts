import { operations } from "#db/schemas/operations";
import { relations } from "#db/schemas/relations";
import { vehicles } from "#db/schemas/vehicle";
import { rootDir } from "#utils/paths";
import { getVehicleSchema, listVehiclesSchema } from "@cm3k/validation";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { reset, seed } from "drizzle-seed";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { createVehicle, getVehicle, listVehicle, removeVehicle, updateVehicle } from "./service";

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

  describe("listVehicle", () => {
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

  describe("getVehicle", () => {
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

  describe("createVehicle", () => {
    it("create a vehicle", async () => {
      const result = await createVehicle({
        brand: "Kia",
        description: "A luxuous yet slow sedan",
        engine: "2.0L CVVT",
        model: "Magentis",
        power: 144,
        trim: "MG",
        year: 2008,
      });
      expect(result).toStrictEqual({ ok: true });
    });
    it("does not create a vehicle if a property is missing", async () => {
      await expect(
        // @ts-expect-error missing property on purpose
        createVehicle({
          description: "A luxuous yet slow sedan",
          engine: "2.0L CVVT",
          model: "Magentis",
          power: 144,
          trim: "MG",
          year: 2008,
        }),
      ).rejects.toThrow(/Failed query/);
    });
  });

  describe("updateVehicle", () => {
    it("update a vehicle", async () => {
      await seed(dbModule.db, { operations, vehicles }).refine(() => ({
        vehicles: {
          columns: {},
          count: 1,
          with: {
            operations: 10,
          },
        },
      }));
      const result = await updateVehicle(1, { brand: "Kia" });
      expect(result).toStrictEqual({ ok: true });
      const updatedVehicle = await dbModule.db.query.vehicles.findFirst({
        where: { id: 1 },
      });
      expect(updatedVehicle?.brand).toStrictEqual("Kia");
    });
    it.todo("returns the correct error type if not found");
  });

  describe("removeVehicle", () => {
    it("remove a vehicle", async () => {
      await seed(dbModule.db, { vehicles }, { count: 2 });
      await removeVehicle(1);
      const result = await listVehicle();
      expect(result).toHaveLength(1);
    });
    it.todo("returns the correct error type if not found");
  });
});
