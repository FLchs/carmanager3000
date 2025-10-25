import { os } from "@orpc/server";
import { eq } from "drizzle-orm";

import { db } from "../db";
import {
  vehicleInsertSchema,
  vehicleSchema,
  vehicleWithLogSchema,
} from "../db/schemas/validation";
import { vehiclesTable } from "../db/schemas/vehicle";

const listvehicles = os
  .route({
    method: "GET",
    path: "/",
  })
  .handler(async () => {
    const vehicles = await db.select().from(vehiclesTable);
    return vehicles;
  });

const findvehicle = os
  .route({
    method: "GET",
    path: "/{id}",
  })
  .input(vehicleSchema.pick({ id: true }))
  .output(vehicleWithLogSchema)
  .handler(async ({ input }) => {
    await new Promise((resolve) => {
      setTimeout(() => resolve(true), 1000);
    });

    const row = await db.query.vehiclesTable.findFirst({
      where: (vehiclesTable, { eq }) => eq(vehiclesTable.id, input.id),
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
  });

const createvehicle = os
  .route({
    method: "POST",
    path: "/",
  })
  .input(
    vehicleInsertSchema.omit({ id: true, createdAt: true, updatedAt: true }),
  )
  .handler(async ({ input }) => {
    console.table(input);
    await db.insert(vehiclesTable).values(input);
    return {
      ok: true,
    };
  });

const editvehicle = os
  .route({
    method: "PUT",
    path: "/{id}",
  })
  .input(vehicleInsertSchema.omit({ createdAt: true, updatedAt: true }))
  .handler(async ({ input }) => {
    const { id, ...data } = input;
    if (id == undefined) {
      return { status: 404 };
    }
    await db.update(vehiclesTable).set(data).where(eq(vehiclesTable.id, id));
    return {
      ok: true,
    };
  });

const deletevehicle = os
  .route({
    method: "DELETE",
    path: "/{id}",
  })
  .input(vehicleSchema.pick({ id: true }))
  .handler(async ({ input }) => {
    await db.delete(vehiclesTable).where(eq(vehiclesTable.id, input.id));
    return {
      ok: true,
    };
  });

export const vehiclesRouter = os.prefix("/vehicles").router({
  create: createvehicle,
  delete: deletevehicle,
  edit: editvehicle,
  find: findvehicle,
  list: listvehicles,
});
