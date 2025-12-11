import * as operationService from "#core/operation/service";
import { createOperationSchema } from "@cm3k/validation";
import { call } from "@orpc/server";
import { beforeAll, describe, expect, it, vi, type Mocked } from "vitest";
import { z } from "zod/v4";

import { router } from ".";

describe("/vehicles", () => {
  describe("GET /{id}/operations", () => {
    let spy: ReturnType<typeof vi.spyOn>;
    beforeAll(() => {
      spy = vi.spyOn(operationService, "listOperations");
    });

    describe("call endpoint with correct arguments", () => {
      it("calls listOperations with correct vehicleId", async () => {
        spy.mockResolvedValue([]);
        await call(router.vehicles.vehicles.operations.list, { params: { vehicleId: 1 } });
        expect(spy).toHaveBeenCalledWith(1);
      });
    });

    describe("throw with bad arguments", () => {
      it("returns error with invalid vehicleId type", async () => {
        await expect(
          // @ts-expect-error: intentionally passing invalid type for testing
          call(router.vehicles.vehicles.operations.list, { params: { vehicleId: "invalid" } }),
        ).rejects.toThrowError(/validation/);
      });
    });
  });

  describe("POST /vehicles/{id}/operations/", () => {
    let spy: Mocked<typeof operationService.createOperation>;
    beforeAll(() => {
      spy = vi.spyOn(operationService, "createOperation").mockResolvedValue({ ok: true });
    });

    const mockOperation = {
      type: "maintenance",
      date: new Date("2024-03-15"),
      mileage: 55000,
      note: "Regular maintenance",
    };

    describe("call endpoint with correct arguments", () => {
      it("calls createOperation with vehicleId from params and body data", async () => {
        await call(router.vehicles.vehicles.operations.create, {
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
          await call(router.vehicles.vehicles.operations.create, {
            body: mockOperation,
            params: { vehicleId: 1 },
          });
          expect(spy).toHaveBeenCalledWith(1, { ...mockOperation });
        });

        it.each(optional)("should not throw without optional property %s", async (a) => {
          const damagedVehicle = { ...mockOperation, [a]: undefined };
          const result = await call(router.vehicles.vehicles.operations.create, {
            body: damagedVehicle,
            params: { vehicleId: 1 },
          });
          expect(result).toStrictEqual({ ok: true });
        });
      });
      describe("call enpoint with bad arguments", () => {
        it.each(required)("should throw without required property %s", async (a) => {
          const damagedVehicle = { ...mockOperation, [a]: undefined };
          await expect(
            // @ts-expect-error: intentionally passing invalid type for testing
            call(router.vehicles.vehicles.operations.create, damagedVehicle),
          ).rejects.toThrowError(/Input validation failed/);
        });
      });
    });
  });

  describe("DELETE /vehicles/operations/{operationId}", () => {
    let spy: Mocked<typeof operationService.removeOperation>;
    beforeAll(() => {
      spy = vi.spyOn(operationService, "removeOperation").mockResolvedValue({ ok: true });
    });

    describe("call endpoint with correct arguments", () => {
      it("calls removeOperation with correct id", async () => {
        await call(router.vehicles.vehicles.operations.remove, { id: 1 });
        expect(spy).toHaveBeenCalledWith(1);
      });
    });

    describe("call endpoint with bad arguments", () => {
      it("rejects with invalid id type", async () => {
        await expect(
          // @ts-expect-error: intentionally passing invalid type for testing
          call(router.vehicles.vehicles.operations.remove, { id: "invalid" }),
        ).rejects.toThrowError(/validation/);
      });
    });
  });
});
