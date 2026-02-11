import * as operationService from "../operations/service";
import { createOperationSchema } from "@cm3k/validation";
import { call, isDefinedError } from "@orpc/server";
import { ok } from "true-myth/result";
import { beforeAll, describe, expect, it, vi, type Mocked } from "vitest";
import { z } from "zod/v4";

import { router } from "../../routers";

const expectDefinedError = async (promise: Promise<unknown>) => {
  try {
    await promise;
  } catch (error) {
    const resolved = await error;
    expect(isDefinedError(resolved)).toBe(true);
    return;
  }

  throw new Error("Expected promise to reject");
};

const vehicles = router.vehicles.vehicles;

describe("/vehicles", () => {
  describe("GET /{id}/operations", () => {
    let spy: ReturnType<typeof vi.spyOn>;
    beforeAll(() => {
      spy = vi.spyOn(operationService, "listOperations");
    });

    describe("call endpoint with correct arguments", () => {
      it("calls listOperations with correct vehicleId", async () => {
        spy.mockResolvedValue(ok([]));
        await call(vehicles.operations.list, { params: { vehicleId: 1 } });
        expect(spy).toHaveBeenCalledWith(1);
      });
    });

    describe("throw with bad arguments", () => {
      it("returns error with invalid vehicleId type", async () => {
        await expectDefinedError(
          // @ts-expect-error: intentionally passing invalid type for testing
          call(vehicles.operations.list, { params: { vehicleId: "invalid" } }),
        );
      });
    });
  });

  describe("POST /vehicles/{id}/operations/", () => {
    let spy: Mocked<typeof operationService.createOperation>;
    beforeAll(() => {
      spy = vi
        .spyOn(operationService, "createOperation")
        .mockResolvedValue(ok(1) as Awaited<ReturnType<typeof operationService.createOperation>>);
      vi.spyOn(operationService, "getOperation").mockResolvedValue(
        ok({
          id: 1,
          date: "2024-03-15T00:00:00.000Z",
          name: "Regular maintenance",
          type: "maintenance",
          mileage: 55000,
          note: "Regular maintenance",
        }) as Awaited<ReturnType<typeof operationService.getOperation>>,
      );
    });

    const mockOperation = {
      name: "Regular maintenance",
      type: "maintenance",
      date: "2024-03-15T00:00:00.000Z",
      mileage: 55000,
      note: "Regular maintenance",
    };

    describe("call endpoint with correct arguments", () => {
      it("calls createOperation with vehicleId from params and body data", async () => {
        await call(vehicles.operations.create, {
          body: mockOperation,
          params: { vehicleId: 1 },
        });
        expect(spy).toHaveBeenCalledWith(1, {
          ...mockOperation,
        });
      });

      const required =
        z.toJSONSchema(createOperationSchema, {
          unrepresentable: "any",
          override: (ctx) => {
            const def = ctx.zodSchema._zod.def;
            if (def.type === "date") {
              ctx.jsonSchema.type = "string";
              ctx.jsonSchema.format = "date-time";
            }
          },
        }).required || [];
      const optional = Object.keys(mockOperation).filter((k) => !required.includes(k));
      describe("call endpoint with correct arguments", () => {
        it("calls createVehicle with correct argument", async () => {
          await call(vehicles.operations.create, {
            body: mockOperation,
            params: { vehicleId: 1 },
          });
          expect(spy).toHaveBeenCalledWith(1, { ...mockOperation });
        });

        it.each(optional)("should not throw without optional property %s", async (a) => {
          const damagedVehicle = { ...mockOperation, [a]: undefined };
          const result = await call(vehicles.operations.create, {
            body: damagedVehicle,
            params: { vehicleId: 1 },
          });
          expect(result.id).toBe(1);
        });
      });
      describe("call enpoint with bad arguments", () => {
        it.each(required)("should throw without required property %s", async (a) => {
          const damagedVehicle = { ...mockOperation, [a]: undefined };
          await expectDefinedError(
            // @ts-expect-error: intentionally passing invalid type for testing
            call(vehicles.operations.create, damagedVehicle),
          );
        });
      });
    });
  });

  describe("DELETE /vehicles/operations/{operationId}", () => {
    let spy: Mocked<typeof operationService.removeOperation>;
    beforeAll(() => {
      spy = vi.spyOn(operationService, "removeOperation").mockResolvedValue(ok() as Awaited<ReturnType<typeof operationService.removeOperation>>);
    });

    describe("call endpoint with correct arguments", () => {
      it("calls removeOperation with correct id", async () => {
        await call(vehicles.operations.remove, {
          params: { vehicleId: 1, id: 1 },
        });
        expect(spy).toHaveBeenCalledWith(1);
      });
    });

    describe("call endpoint with bad arguments", () => {
      it("rejects with invalid id type", async () => {
        await expectDefinedError(
          call(vehicles.operations.remove, {
            params: {
              vehicleId: 1,
              // @ts-expect-error: intentionally passing invalid type for testing
              id: "invalid",
            },
          }),
        );
      });
    });
  });
});
