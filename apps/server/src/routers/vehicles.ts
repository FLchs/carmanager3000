import { os } from "@orpc/server";
import { eq } from "drizzle-orm";
import * as z from "zod";

import { db } from "@/db";
import { vehiclesTable } from "@/db/schemas/vehicle";

const vehicleSchema = z.object({
  id: z.coerce.number().min(0),
  name: z.string(),
});

const listvehicles = os
  .route({
    method: "GET",
    path: "/",
  })
  .output(z.array(vehicleSchema))
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
  .input(vehicleSchema.pick({ name: true }))
  .handler(async ({ input }) => {
    await db.insert(vehiclesTable).values({ name: input.name });
    return {
      ok: true,
    };
  });

export const vehiclesRouter = os.prefix("/vehicles").router({
  create: createvehicle,
  find: findvehicle,
  list: listvehicles,
});
