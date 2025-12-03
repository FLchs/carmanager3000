import { db } from "#db/index";
import { vehicles } from "#db/schemas/vehicle";
import { createVehicleSchema, updateVehicleSchema } from "@cm3k/validation";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";

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

  if (row == undefined) throw new Error("wbi");
  return row;
};

export const createVehicle = async (
  input: z.infer<typeof createVehicleSchema>,
) => {
  console.table(input);
  await db.insert(vehicles).values(input);
  return {
    ok: true,
  };
};

export const updateVehicle = async (
  id: number,
  input: z.infer<typeof updateVehicleSchema>,
) => {
  if (id == undefined) {
    return { status: 404 };
  }
  await db.update(vehicles).set(input).where(eq(vehicles.id, id));
  return {
    ok: true,
  };
};

export const removeVehicle = async (id: number) => {
  await db.delete(vehicles).where(eq(vehicles.id, id));
  return {
    ok: true,
  };
};
