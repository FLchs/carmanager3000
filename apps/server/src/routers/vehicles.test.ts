import * as operationService from "#core/operation/service";
import * as vehicleService from "#core/vehicle/service";
import { createVehicleSchema, updateVehicleSchema } from "@cm3k/validation";
import { call } from "@orpc/server";
import { beforeAll, describe, expect, it, vi, type Mocked } from "vitest";
import * as z from "zod/v4";

import { router } from ".";

describe("/vehicles", () => {
  describe("GET /", () => {
    let spy: Mocked<typeof vehicleService.listVehicle>;
    beforeAll(() => {
      spy = vi.spyOn(vehicleService, "listVehicle").mockResolvedValue([]);
    });

    it("calls listVehicle", async () => {
      await call(router.vehicles.vehicles.list, {});
      expect(spy).toHaveBeenCalled();
    });
  });
  describe("GET /{id}", () => {
    let spy: Mocked<typeof vehicleService.getVehicle>;
    beforeAll(() => {
      spy = vi.spyOn(vehicleService, "getVehicle");
    });

    describe("call endpoint with correct arguments", () => {
      it("calls getVehicle with correct argument", async () => {
        await call(router.vehicles.vehicles.get, { id: 12 });
        expect(spy).toHaveBeenCalledWith(12);
      });
    });

    describe("call endpoint with bad arguments", () => {
      it("return error with bad argument", async () => {
        // TODO: good place to start typed error checking
        await expect(call(router.vehicles.vehicles.get, { id: "hello" })).rejects.toThrowError(
          /validation/,
        );
      });
    });
  });
  describe("POST /", () => {
    let spy: Mocked<typeof vehicleService.createVehicle>;
    beforeAll(() => {
      spy = vi.spyOn(vehicleService, "createVehicle").mockResolvedValue({ ok: true });
    });
    const mockVehicle: z.infer<typeof createVehicleSchema> = {
      brand: "Kia",
      description: "Good but slow sedan",
      engine: "2.0l CVVT",
      model: "Magentis",
      power: 144,
      trim: "MG",
      year: 2008,
    };

    const required = z.toJSONSchema(createVehicleSchema).required || [];
    const optional = Object.keys(mockVehicle).filter((k) => !required.includes(k));
    describe("call endpoint with correct arguments", () => {
      it("calls createVehicle with correct argument", async () => {
        await call(router.vehicles.vehicles.create, mockVehicle);
        expect(spy).toHaveBeenCalledWith(mockVehicle);
      });

      it.each(optional)("should not throw without optional property %s", async (a) => {
        const damagedVehicle = { ...mockVehicle, [a]: undefined };
        const result = await call(router.vehicles.vehicles.create, damagedVehicle);
        expect(result).toStrictEqual({ ok: true });
      });
    });
    describe("call enpoint with bad arguments", () => {
      it.each(required)("should throw without required property %s", async (a) => {
        const damagedVehicle = { ...mockVehicle, [a]: undefined };
        await expect(call(router.vehicles.vehicles.create, damagedVehicle)).rejects.toThrowError(
          /Input validation failed/,
        );
      });
    });
  });

  describe("PUT /", () => {
    let spy: Mocked<typeof vehicleService.updateVehicle>;
    beforeAll(() => {
      spy = vi.spyOn(vehicleService, "updateVehicle").mockResolvedValue({ ok: true });
    });
    const mockVehicle: z.infer<typeof updateVehicleSchema> = {
      brand: "Kia",
      description: "Good but slow sedan",
      engine: "2.0l CVVT",
      model: "Magentis",
      power: 144,
      trim: "MG",
      year: 2008,
    };

    const required = z.toJSONSchema(updateVehicleSchema).required || [];
    const optional = Object.keys(mockVehicle).filter((k) => !required.includes(k));
    describe("call endpoint with correct arguments", () => {
      it("calls createVehicle with correct argument", async () => {
        await call(router.vehicles.vehicles.update, { body: mockVehicle, params: { id: 1 } });
        expect(spy).toHaveBeenCalledWith(1, mockVehicle);
      });

      it.each(optional)("should not throw without optional property %s", async (a) => {
        const damagedVehicle = { ...mockVehicle, [a]: undefined };
        const result = await call(router.vehicles.vehicles.update, {
          body: damagedVehicle,
          params: { id: 1 },
        });
        expect(result).toStrictEqual({ ok: true });
      });
    });
    describe("call enpoint with bad arguments", () => {
      it("should throw throw with id change", async () => {
        const damagedVehicle = { ...mockVehicle, id: 2, random: "ishouldnotbehere" };
        await call(router.vehicles.vehicles.update, { body: damagedVehicle, params: { id: 1 } });
        expect(spy).toHaveBeenCalledWith(1, mockVehicle);
      });
    });
  });

  describe("DELETE /", () => {
    let spy: Mocked<typeof vehicleService.removeVehicle>;
    beforeAll(() => {
      spy = vi.spyOn(vehicleService, "removeVehicle").mockResolvedValue({ ok: true });
    });
    describe("call endpoint with correct arguments", () => {
      it("calls createVehicle with correct argument", async () => {
        await call(router.vehicles.vehicles.remove, { id: 1 });
        expect(spy).toHaveBeenCalledWith(1);
      });
    });
  });

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

      it("returns operations for the specified vehicle", async () => {
        const mockOperations = [
          {
            id: 1,
            type: "maintenance" as const,
            date: new Date("2024-01-15"),
            mileage: 50000,
            note: "Oil change",
          },
          {
            id: 2,
            type: "repair" as const,
            date: new Date("2024-02-20"),
            mileage: 52000,
            note: "Brake pads replacement",
          },
        ];
        spy.mockResolvedValue(mockOperations);
        const result = await call(router.vehicles.vehicles.operations.list, {
          params: { vehicleId: 1 },
        });
        expect(result).toEqual(mockOperations);
        expect(spy).toHaveBeenCalledWith(1);
      });
    });

    describe("call endpoint with bad arguments", () => {
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
          params: { id: 1 },
        });
        expect(spy).toHaveBeenCalledWith({
          ...mockOperation,
          vehicleId: 1,
        });
      });

      it("accepts operation with nullable fields", async () => {
        const operationWithNulls = {
          type: null,
          date: null,
          mileage: null,
          note: null,
        };
        const result = await call(router.vehicles.vehicles.operations.create, {
          body: operationWithNulls,
          params: { id: 1 },
        });
        expect(result).toStrictEqual({ ok: true });
        expect(spy).toHaveBeenCalledWith({
          ...operationWithNulls,
          vehicleId: 1,
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
