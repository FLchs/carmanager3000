import { db } from "#db/index";
import { vehicles } from "#db/schemas/vehicle";
import { DbError, NotFoundError } from "#lib/serviceErrors";
import { createVehicleSchema, updateVehicleSchema } from "@cm3k/validation";
import { eq } from "drizzle-orm";
import { ok, err } from "true-myth/result";
import * as z from "zod/v4";

export const listVehicle = async () => {
  try {
    const vehiclesList = await db.query.vehicles.findMany({
      where: { deleted: false },
      columns: {
        id: true,
        brand: true,
        description: true,
        engine: true,
        model: true,
        power: true,
        trim: true,
        year: true,
      },
    });
    return ok(vehiclesList);
  } catch {
    return err(new DbError());
  }
};

export const getVehicle = async (id: number) => {
  const row = await db.query.vehicles.findFirst({
    where: { id },
    columns: {
      id: true,
      brand: true,
      description: true,
      engine: true,
      model: true,
      power: true,
      trim: true,
      year: true,
    },
    with: {
      operations: {
        columns: {
          id: true,
          date: true,
          mileage: true,
          note: true,
          type: true,
        },
      },
    },
  });
  if (row !== undefined) {
    return ok(row);
  }
  return err(new NotFoundError("Vehicle not found"));
};

export const createVehicle = async (input: z.infer<typeof createVehicleSchema>) => {
  try {
    const [{ id }] = await db.insert(vehicles).values(input).returning({
      id: vehicles.id,
    });
    return ok(id);
  } catch (error) {
    return err(new DbError(error));
  }
};

export const updateVehicle = async (id: number, input: z.infer<typeof updateVehicleSchema>) => {
  try {
    const vehicle = await db.update(vehicles).set(input).where(eq(vehicles.id, id)).returning();
    if (vehicle.length === 0) {
      return err(new NotFoundError("Vehicle not found"));
    }
    return ok();
  } catch (error) {
    return err(new DbError(error));
  }
};

export const removeVehicle = async (id: number) => {
  try {
    const result = await db
      .update(vehicles)
      .set({ deleted: true })
      .where(eq(vehicles.id, id))
      .returning();
    if (result.length === 0) {
      return err(new NotFoundError("Vehicle not found"));
    }
    return ok();
  } catch (error) {
    return err(new DbError(error));
  }
};
