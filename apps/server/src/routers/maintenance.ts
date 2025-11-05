import { db } from "#db/index";
import { maintenanceLogTable } from "#db/schemas/maintenanceLog";
import { maintenanceLogSelectSchema } from "#db/schemas/validation";
import { os } from "@orpc/server";
import * as z from "zod/v4";

const findVehicleMaintenancelogs = os
  .route({
    method: "GET",
    path: "/{id}/logs",
  })
  .input(maintenanceLogSelectSchema.pick({ id: true }))
  .output(
    z.array(
      maintenanceLogSelectSchema.omit({
        createdAt: true,
        updatedAt: true,
        vehicleId: true,
      }),
    ),
  )
  .handler(async ({ input }) => {
    const logs = await db.query.maintenanceLogTable.findMany({
      where: (fields, { eq }) => eq(fields.vehicleId, input.id),
      columns: {
        id: true,
        date: true,
        mileage: true,
        note: true,
        type: true,
      },
    });
    await new Promise((resolve) => {
      setTimeout(() => resolve(true), 1000);
    });
    return logs;
  });

const createvehiclelog = os
  .route({
    inputStructure: "detailed",
    method: "POST",
    path: "/{id}",
  })
  .input(
    z.object({
      body: mlInsertSchema,
      params: z.object({ id: z.coerce.number() }),
    }),
  )
  .handler(async ({ input }) => {
    console.table(input);
    await new Promise((resolve) => {
      setTimeout(() => resolve(true), 2000);
    });

    await db
      .insert(maintenanceLogTable)
      .values({ ...input.body, vehicleId: input.params.id });
    return {
      ok: true,
    };
  });

export const vehiclesRouter = os.prefix("/vehicles").router({
  logs: {
    create: createvehiclelog,
    find: findVehicleMaintenancelogs,
  },
});
