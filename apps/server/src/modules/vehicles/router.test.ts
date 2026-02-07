import * as vehicleService from "./service";
import { NotFoundError } from "#lib/serviceErrors";
import { createVehicleSchema, getVehicleSchema, updateVehicleSchema } from "@cm3k/validation";
import { call, isDefinedError } from "@orpc/server";
import { err, ok } from "true-myth/result";
import { beforeAll, describe, expect, it, vi, type Mocked } from "vitest";
import * as z from "zod/v4";

import { vehiclesRouter } from "./router";

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

describe("/vehicles", () => {
  describe("GET /", () => {
    let spy: Mocked<typeof vehicleService.listVehicle>;
    beforeAll(() => {
      spy = vi
        .spyOn(vehicleService, "listVehicle")
        .mockResolvedValue(ok([]) as Awaited<ReturnType<typeof vehicleService.listVehicle>>);
    });

    it("calls listVehicle", async () => {
      await call(vehiclesRouter.vehicles.list, {});
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
      };
      // @ts-expect-error: intentionally passing invalid type for testing
      spy = vi.spyOn(vehicleService, "getVehicle").mockResolvedValue(ok(mockVehicle));
    });

    describe("call endpoint with correct arguments", () => {
      it("calls getVehicle with correct argument", async () => {
        await call(vehiclesRouter.vehicles.get, { id: 12 });
        expect(spy).toHaveBeenCalledWith(12);
      });
    });

    describe("call endpoint with bad arguments", () => {
      it("return error with bad argument", async () => {
        // TODO: good place to start typed error checking
        // @ts-expect-error: intentionally passing invalid type for testing
        await expectDefinedError(call(vehiclesRouter.vehicles.get, { id: "hello" }));
      });

      it("return error with unknown id", async () => {
        // TODO: good place to start typed error checking
        spy = vi
          .spyOn(vehicleService, "getVehicle")
          // @ts-expect-error: intentionally passing invalid type for testing
          .mockResolvedValue(err(new NotFoundError({ data: { message: "error" } })));
        await expectDefinedError(call(vehiclesRouter.vehicles.get, { id: 12 }));
      });
    });
  });
  describe("POST /", () => {
    const mockVehicle: z.infer<typeof createVehicleSchema> = {
      brand: "Kia",
      description: "Good but slow sedan",
      engine: "2.0l CVVT",
      model: "Magentis",
      power: 144,
      trim: "MG",
      year: 2008,
    };

    let spy: Mocked<typeof vehicleService.createVehicle>;
    let getVehicleSpy: Mocked<typeof vehicleService.getVehicle>;
    beforeAll(() => {
      spy = vi
        .spyOn(vehicleService, "createVehicle")
        .mockResolvedValue(ok(1) as Awaited<ReturnType<typeof vehicleService.createVehicle>>);
      getVehicleSpy = vi
        .spyOn(vehicleService, "getVehicle")
        .mockResolvedValue(
          ok({ ...mockVehicle, id: 1, operations: [] }) as Awaited<
            ReturnType<typeof vehicleService.getVehicle>
          >,
        );
    });

    const required = z.toJSONSchema(createVehicleSchema).required || [];
    const optional = Object.keys(mockVehicle).filter((k) => !required.includes(k));
    describe("call endpoint with correct arguments", () => {
      it("calls createVehicle with correct argument", async () => {
        await call(vehiclesRouter.vehicles.create, mockVehicle);
        expect(spy).toHaveBeenCalledWith(mockVehicle);
      });

      it.each(optional)("should not throw without optional property %s", async (a) => {
        const damagedVehicle = { ...mockVehicle, [a]: undefined };
        const result = await call(vehiclesRouter.vehicles.create, damagedVehicle);
        expect(result.id).toBe(1);
      });
    });
    describe("call enpoint with bad arguments", () => {
      it.each(required)("should throw without required property %s", async (a) => {
        const damagedVehicle = { ...mockVehicle, [a]: undefined };
        await expectDefinedError(call(vehiclesRouter.vehicles.create, damagedVehicle));
      });
    });
  });

  describe("PUT /", () => {
    const mockVehicle: z.infer<typeof updateVehicleSchema> = {
      brand: "Kia",
      description: "Good but slow sedan",
      engine: "2.0l CVVT",
      model: "Magentis",
      power: 144,
      trim: "MG",
      year: 2008,
    };

    let spy: Mocked<typeof vehicleService.updateVehicle>;
    let getVehicleSpy: Mocked<typeof vehicleService.getVehicle>;
    beforeAll(() => {
      spy = vi.spyOn(vehicleService, "updateVehicle").mockResolvedValue(ok());
      getVehicleSpy = vi
        .spyOn(vehicleService, "getVehicle")
        .mockResolvedValue(
          ok({ ...mockVehicle, id: 1, operations: [] }) as Awaited<
            ReturnType<typeof vehicleService.getVehicle>
          >,
        );
    });

    const required = z.toJSONSchema(updateVehicleSchema).required || [];
    const optional = Object.keys(mockVehicle).filter((k) => !required.includes(k));
    describe("call endpoint with correct arguments", () => {
      it("calls createVehicle with correct argument", async () => {
        await call(vehiclesRouter.vehicles.update, { body: mockVehicle, params: { id: 1 } });
        expect(spy).toHaveBeenCalledWith(1, mockVehicle);
      });

      it.each(optional)("should not throw without optional property %s", async (a) => {
        const damagedVehicle = { ...mockVehicle, [a]: undefined };
        const result = await call(vehiclesRouter.vehicles.update, {
          body: damagedVehicle,
          params: { id: 1 },
        });
        expect(result.id).toBe(1);
      });
    });
    describe("call enpoint with bad arguments", () => {
      it("should throw throw with id change", async () => {
        const damagedVehicle = { ...mockVehicle, id: 2, random: "ishouldnotbehere" };
        await call(vehiclesRouter.vehicles.update, { body: damagedVehicle, params: { id: 1 } });
        expect(spy).toHaveBeenCalledWith(1, mockVehicle);
      });
    });
  });

  describe("DELETE /", () => {
    let spy: Mocked<typeof vehicleService.removeVehicle>;
    beforeAll(() => {
      spy = vi.spyOn(vehicleService, "removeVehicle").mockResolvedValue(ok());
    });
    describe("call endpoint with correct arguments", () => {
      it("calls createVehicle with correct argument", async () => {
        await call(vehiclesRouter.vehicles.remove, { id: 1 });
        expect(spy).toHaveBeenCalledWith(1);
      });
    });
  });
});
