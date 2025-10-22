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
  // .output(z.array(vehicleSchema))
  .handler(async () => {
    const vehicles = await db.select().from(vehiclesTable);
    return vehicles;
  });

// const findVehicleOutputSchema = z.object({
//   maintenanceLog: z.array(maintenanceLogSelectSchema).default([]), // always an array
//   vehicle: vehicleSchema, // keep vehicle nested
// });

const findvehicle = os
  .route({
    method: "GET",
    path: "/{id}",
  })
  .input(vehicleSchema.pick({ id: true }))
  .output(vehicleWithLogSchema)
  .handler(async ({ input }) => {
    // const [row] = await db2.query.vehiclesTable.findMany({
    //   where: (vehiclesTable, { eq }) => eq(vehiclesTable.id, input.id),
    //   with: { maintenanceLog: true },
    // });
    //

    // await db.insert(maintenanceLogTable).values({
    //   date: new Date(),
    //   mileage: 123_098,
    //   note: "Used Castrol",
    //   type: "Oil change",
    //   vehicleId: input.id,
    // });

    const row = await db.query.vehiclesTable.findFirst({
      where: (vehiclesTable, { eq }) => eq(vehiclesTable.id, input.id),
      with: {
        maintenanceLog: true,
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
