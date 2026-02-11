import { db } from "#db/index";
import { operations } from "#db/schemas/operations";
import { DbError, NotFoundError } from "#lib/serviceErrors";
import { createOperationSchema, updateOperationSchema } from "@cm3k/validation";
import { eq } from "drizzle-orm";
import { ok, err } from "true-myth/result";
import * as z from "zod/v4";

const toIsoString = (value: Date | null | undefined) => (value ? value.toISOString() : null);

export const listOperations = async (vehicleId?: number) => {
  try {
    const whereClause = {
      deleted: false,
      ...(vehicleId !== undefined ? { vehicleId } : {}),
    };
    const operationsList = await db.query.operations.findMany({
      where: whereClause,
      columns: {
        id: true,
        date: true,
        name: true,
        mileage: true,
        note: true,
        type: true,
      },
    });
    return ok(
      operationsList.map((operation) => ({
        ...operation,
        date: toIsoString(operation.date),
      })),
    );
  } catch (error) {
    return err(new DbError(error));
  }
};

export const getOperation = async (id: number) => {
  try {
    const operation = await db.query.operations.findFirst({
      where: { id },
      columns: {
        id: true,
        date: true,
        name: true,
        mileage: true,
        note: true,
        type: true,
      },
    });
    if (operation) {
      return ok({
        ...operation,
        date: toIsoString(operation.date),
      });
    }
    return err(new NotFoundError("Operation not found"));
  } catch (eror) {
    return err(new DbError(eror));
  }
};

export const createOperation = async (id: number, input: z.infer<typeof createOperationSchema>) => {
  try {
    const { date, ...rest } = input;
    const dbDate = date ? new Date(date) : null;
    const [operation] = await db
      .insert(operations)
      .values({ ...rest, date: dbDate, vehicleId: id })
      .returning({ id: operations.id });
    return ok(operation.id);
  } catch (error) {
    return err(new DbError(error));
  }
};

export const updateOperation = async (id: number, input: z.infer<typeof updateOperationSchema>) => {
  try {
    const { date, ...rest } = input;
    const updateData = {
      ...rest,
      ...(date !== undefined ? { date: date ? new Date(date) : null } : {}),
    };
    const result = await db
      .update(operations)
      .set(updateData)
      .where(eq(operations.id, id))
      .returning();
    if (result.length === 0) {
      return err(new NotFoundError("Operation not found"));
    }
    return ok();
  } catch (error) {
    return err(new DbError(error));
  }
};

export const removeOperation = async (id: number) => {
  try {
    const result = await db
      .update(operations)
      .set({ deleted: true })
      .where(eq(operations.id, id))
      .returning();
    if (result.length === 0) {
      return err(new NotFoundError("Operation not found"));
    }
    return ok();
  } catch (error) {
    return err(new DbError(error));
  }
};
