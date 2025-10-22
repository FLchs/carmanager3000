import { os } from "@orpc/server";
import { eq } from "drizzle-orm";
import * as z from "zod/v4";

import { maintenanceLogTable } from "@/db/schemas/maintenanceLog";
import {
  maintenanceLogInsertSchema,
  maintenanceLogSelectSchema,
} from "@/db/schemas/validation";

import { db } from "../db";

const listvehiclelogs = os
  .route({
    method: "GET",
    path: "/{id}/logs",
  })
  .input(maintenanceLogSelectSchema.pick({ id: true }))
  .output(z.array(maintenanceLogSelectSchema))
  .handler(async ({ input }) => {
    const logs = await db
      .select()
      .from(maintenanceLogTable)
      .where(eq(maintenanceLogTable.id, input.id));

    return logs;
  });

const createvehiclelog = os
  .route({
    method: "POST",
    path: "/{id}/logs",
  })
  .input(
    maintenanceLogInsertSchema.omit({
      id: true,
      createdAt: true,
      updatedAt: true,
    }),
  )
  .handler(async ({ input }) => {
    console.table(input);
    await db.insert(maintenanceLogTable).values(input);
    return {
      ok: true,
    };
  });
export const vehiclesRouter = os.prefix("/vehicles").router({
  logs: {
    create: createvehiclelog,
    list: listvehiclelogs,
  },
});
