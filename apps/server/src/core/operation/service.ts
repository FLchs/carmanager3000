import { db } from "#db/index";
import { operations } from "#db/schemas/operations";
import { DbError, NotFoundError } from "#lib/serviceErrors";
import { createOperationSchema, updateOperationSchema } from "@cm3k/validation";
import { eq } from "drizzle-orm";
import { ok, err } from "true-myth/result";
import * as z from "zod/v4";

export const listOperations = async (vehicleId?: number) => {
  try {
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
    return ok(operationsList);
  } catch {
    return err(new DbError());
  }
};

export const getOperation = async (id: number) => {
  try {
    const operation = await db.query.operations.findFirst({
      where: { id },
      columns: {
        id: true,
        date: true,
        mileage: true,
        note: true,
        type: true,
      },
    });
    if (operation !== undefined) {
      return ok(operation);
    }
    return err(new NotFoundError("Operation not found"));
  } catch {
    return err(new DbError());
  }
};

export const createOperation = async (id: number, input: z.infer<typeof createOperationSchema>) => {
  try {
    const [operation] = await db
      .insert(operations)
      .values({ ...input, vehicleId: id })
      .returning({ id: operations.id });
    return ok(operation.id);
  } catch {
    return err(new DbError());
  }
};

export const updateOperation = async (id: number, input: z.infer<typeof updateOperationSchema>) => {
  try {
    const result = await db.update(operations).set(input).where(eq(operations.id, id)).returning();
    if (result.length === 0) {
      return err(new NotFoundError("Operation not found"));
    }
    return ok();
  } catch {
    return err(new DbError());
  }
};

export const removeOperation = async (id: number) => {
  try {
    const result = await db.delete(operations).where(eq(operations.id, id)).returning();
    if (result.length === 0) {
      return err(new NotFoundError("Operation not found"));
    }
    return ok();
  } catch {
    return err(new DbError());
  }
};
