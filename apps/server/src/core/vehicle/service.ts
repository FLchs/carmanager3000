import { db } from "#db/index";
import { vehicles } from "#db/schemas/vehicle";
import { NotFoundError } from "#lib/errors";
import { createVehicleSchema, updateVehicleSchema } from "@cm3k/validation";
import { eq } from "drizzle-orm";
import { ok, err } from "true-myth/result";
import * as z from "zod/v4";

export const listVehicle = async () => {
  const vehiclesList = await db.select().from(vehicles);
  return vehiclesList;
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
  return err(new NotFoundError({ data: { message: "Vehicle not found" } }));
};

export const createVehicle = async (input: z.infer<typeof createVehicleSchema>) => {
  await db.insert(vehicles).values(input);
  // TODO: return correct error
  return {
    ok: true,
  };
};

export const updateVehicle = async (id: number, input: z.infer<typeof updateVehicleSchema>) => {
  if (id == undefined) {
    return { status: 404 };
  }
  await db.update(vehicles).set(input).where(eq(vehicles.id, id));
  return {
    ok: true,
  };
};

export const removeVehicle = async (id: number) => {
  const result = await db.delete(vehicles).where(eq(vehicles.id, id));
  console.log(result);
  return {
    ok: true,
  };
};
