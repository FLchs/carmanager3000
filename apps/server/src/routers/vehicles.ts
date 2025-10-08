import { os } from "@orpc/server";
import { eq } from "drizzle-orm";

import { db } from "../db";
import {
  vehicleInsertSchema,
  vehicleSchema,
  vehiclesTable,
} from "../db/schemas/vehicle";

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

const findvehicle = os
  .route({
    method: "GET",
    path: "/{id}",
  })
  .input(vehicleSchema.pick({ id: true }))
  .output(vehicleSchema)
  .handler(async ({ input }) => {
    const [vehicle] = await db
      .select()
      .from(vehiclesTable)
      .where(eq(vehiclesTable.id, input.id));
    return vehicle;
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
  find: findvehicle,
  list: listvehicles,
});
