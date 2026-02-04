import * as documentService from "#core/documents/service";
import { createDocumentSchema } from "@cm3k/validation";
import { call, isDefinedError } from "@orpc/server";
import { ok } from "true-myth/result";
import { beforeAll, describe, expect, it, vi, type Mocked } from "vitest";
import { z } from "zod/v4";

import { router } from ".";

describe("/vehicles", () => {
  describe("GET /{id}/documents", () => {
    let spy: ReturnType<typeof vi.spyOn>;
    beforeAll(() => {
      spy = vi.spyOn(documentService, "listDocuments");
    });

    describe("call endpoint with correct arguments", () => {
      it("calls listDocuments with correct vehicleId and entityType", async () => {
        spy.mockResolvedValue(ok([]));
        await call(router.vehicles.vehicles.documents.list, { params: { vehicleId: 1 } });
        expect(spy).toHaveBeenCalledWith(1, "vehicle");
      });
    });

    describe("throw with bad arguments", () => {
      it("returns error with invalid vehicleId type", async () => {
        await expect(
          // @ts-expect-error: intentionally passing invalid type for testing
          call(router.vehicles.vehicles.documents.list, { params: { vehicleId: "invalid" } }),
        ).rejects.toSatisfy((err) => isDefinedError(err));
      });
    });
  });

  describe("POST /vehicles/{id}/documents/", () => {
    let spy: Mocked<typeof documentService.createDocument>;
    beforeAll(() => {
      spy = vi
        .spyOn(documentService, "createDocument")
        .mockResolvedValue(ok(1) as Awaited<ReturnType<typeof documentService.createDocument>>);
      vi.spyOn(documentService, "getDocument").mockResolvedValue(
        ok({
          id: 1,
          name: "Test Document",
          date: new Date("2024-03-15"),
          type: { name: "THing" },
          mileage: 55000,
          note: "Insurance document",
          uri: "https://example.com/doc.pdf",
        }) as Awaited<ReturnType<typeof documentService.getDocument>>,
      );
    });

    const mockDocument = {
      name: "Test Document",
      typeId: 1,
      date: new Date("2024-03-15"),
      mileage: 55000,
      note: "Insurance document",
      file: new File([], "testfile.pdf"),
    };

    describe("call endpoint with correct arguments", () => {
      it("calls createDocument with vehicleId from params and body data", async () => {
        await call(router.vehicles.vehicles.documents.create, {
          body: mockDocument,
          params: { vehicleId: 1 },
        });
        expect(spy).toHaveBeenCalledWith({
          ...mockDocument,
          entityId: 1,
          entityType: "vehicle",
        });
      });

      const required =
        z.toJSONSchema(createDocumentSchema, {
          unrepresentable: "any",
          override: (ctx) => {
            const def = ctx.zodSchema._zod.def;
            if (def.type === "date") {
              ctx.jsonSchema.type = "string";
              ctx.jsonSchema.format = "date-time";
            }
          },
        }).required || [];
      const optional = Object.keys(mockDocument).filter((k) => !required.includes(k));
      describe("call endpoint with correct arguments", () => {
        it("calls createDocument with correct argument", async () => {
          await call(router.vehicles.vehicles.documents.create, {
            body: mockDocument,
            params: { vehicleId: 1 },
          });
          expect(spy).toHaveBeenCalledWith({
            ...mockDocument,
            entityId: 1,
            entityType: "vehicle",
          });
        });

        it.each(optional)("should not throw without optional property %s", async (a) => {
          const damagedDocument = { ...mockDocument, [a]: undefined };
          const result = await call(router.vehicles.vehicles.documents.create, {
            body: damagedDocument,
            params: { vehicleId: 1 },
          });
          expect(result.id).toBe(1);
        });
      });
      describe("call endpoint with bad arguments", () => {
        it.each(required)("should throw without required property %s", async (a) => {
          const damagedDocument = { ...mockDocument, [a]: undefined };
          await expect(
            // @ts-expect-error: intentionally passing invalid type for testing
            call(router.vehicles.vehicles.documents.create, damagedDocument),
          ).rejects.toSatisfy((err) => isDefinedError(err));
        });
      });
    });
  });
});
