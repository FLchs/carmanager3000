import { db } from "#db/index";
import { operations } from "#db/schemas/operations";
import * as z from "zod/v4";

import { operationInsertSchema } from "./validation";

export const listOperations = async (vehicleId?: number) => {
  console.log(vehicleId);
  const test = await db.query.operations.findMany();
  console.table(test);
  const operationsList = await db.query.operations.findMany({
    where: vehicleId
      ? (operations, { eq }) => eq(operations.vehicleId, vehicleId)
      : undefined,
  });
  return operationsList;
};

export const createOperation = async (
  input: z.infer<typeof operationInsertSchema>,
) => {
  console.table(input);
  await db.insert(operations).values(input);
  return {
    ok: true,
  };
};
