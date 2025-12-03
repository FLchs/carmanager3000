import { db } from "#db/index";
import { operations } from "#db/schemas/operations";
import { createOperationSchema, operationSchema } from "@cm3k/validation";
import { eq } from "drizzle-orm";
import * as z from "zod/v4";

export const listOperations = async (vehicleId?: number) => {
  const operationsList = await db.query.operations.findMany({
    where: { vehicleId },
    columns: {
      id: true,
      date: true,
      mileage: true,
      note: true,
      type: true,
    },
  });
  return operationsList;
};

export const getOperation = async (id: number) => {
  const operation = await db.query.operations.findFirst({
    where: { id },
  });
  return operation;
};

export const createOperation = async (
  input: z.infer<typeof createOperationSchema>,
) => {
  console.table(input);
  await db.insert(operations).values(input);
  return {
    ok: true,
  };
};

export const updateOperation = async (
  input: z.infer<typeof operationSchema>,
) => {
  console.table(input);
  await db.update(operations).set(input).where(eq(operations.id, input.id));
  return {
    ok: true,
  };
};

export const removeOperation = async (id: number) => {
  await db.delete(operations).where(eq(operations.id, id));
  return {
    ok: true,
  };
};
