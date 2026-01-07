import * as vehicleService from "#core/vehicle/service";
import { NotFoundError } from "#lib/errors";
import { createVehicleSchema, getVehicleSchema, updateVehicleSchema } from "@cm3k/validation";
import { call, isDefinedError } from "@orpc/server";
import { err, ok } from "true-myth/result";
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
      const mockVehicle: z.infer<typeof getVehicleSchema> = {
        brand: "Kia",
        description: "Good but slow sedan",
        engine: "2.0l CVVT",
        model: "Magentis",
        power: 144,
        trim: "MG",
        year: 2008,
        id: 1,
        operations: [],
      };
      // @ts-expect-error: intentionally passing invalid type for testing
      spy = vi.spyOn(vehicleService, "getVehicle").mockResolvedValue(ok(mockVehicle));
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
        // @ts-expect-error: intentionally passing invalid type for testing
        await expect(call(router.vehicles.vehicles.get, { id: "hello" })).rejects.toThrowError(
          /validation/,
        );
      });

      it("return error with unknown id", async () => {
        // TODO: good place to start typed error checking
        spy = vi
          .spyOn(vehicleService, "getVehicle")
          // @ts-expect-error: intentionally passing invalid type for testing
          .mockResolvedValue(err(new NotFoundError({ data: { message: "error" } })));
        await expect(call(router.vehicles.vehicles.get, { id: 12 })).rejects.toSatisfy((error) =>
          isDefinedError(error),
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
});
