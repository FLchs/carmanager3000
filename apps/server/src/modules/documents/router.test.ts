import * as documentService from "./service";
import { call } from "@orpc/server";
import { ok } from "true-myth/result";
import { beforeAll, describe, expect, it, vi, type Mocked } from "vitest";

import { documentsRouter } from "./router";

describe("/documents", () => {
  describe("DELETE /documents/{id}", () => {
    let spy: Mocked<typeof documentService.removeDocument>;
    beforeAll(() => {
      spy = vi.spyOn(documentService, "removeDocument").mockResolvedValue(ok());
    });
    it("calls createVehicle with correct argument", async () => {
      await call(documentsRouter.documents.remove, { id: 1 });
      expect(spy).toHaveBeenCalledWith(1);
    });
  });
});
