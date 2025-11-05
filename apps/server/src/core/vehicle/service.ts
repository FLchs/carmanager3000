import { db } from "#db/index";
import { vehicleInsertSchema } from "#db/schemas/validation";
import { vehiclesTable } from "#db/schemas/vehicle";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";

export const listVehicle = async () => {
  const vehicles = await db.select().from(vehiclesTable);
  return vehicles;
};

export const getVehicle = async (id: number) => {
  const row = await db.query.vehiclesTable.findFirst({
    where: (vehiclesTable, { eq }) => eq(vehiclesTable.id, id),
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
      maintenanceLog: {
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
  input: z.infer<typeof vehicleInsertSchema>,
) => {
  console.table(input);
  await db.insert(vehiclesTable).values(input);
  return {
    ok: true,
  };
};

export const updateVehicle = async (
  input: z.infer<typeof vehicleInsertSchema>,
) => {
  const { id, ...data } = input;
  if (id == undefined) {
    return { status: 404 };
  }
  await db.update(vehiclesTable).set(data).where(eq(vehiclesTable.id, id));
  return {
    ok: true,
  };
};

export const removeVehicle = async (id: number) => {
  await db.delete(vehiclesTable).where(eq(vehiclesTable.id, id));
  return {
    ok: true,
  };
};
