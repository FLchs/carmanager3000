import { OpenAPIGenerator } from "@orpc/openapi";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { ok } from "true-myth/result";

import * as documentService from "#core/documents/service";
import * as documentTypeService from "#core/documentTypes/service";
import * as operationService from "#core/operation/service";
import * as vehicleService from "#core/vehicle/service";

import {
  buildInvalidRequestBody,
  buildInvalidValueFromSchema,
  buildPathParams,
  buildQueryParams,
  buildRequestBody,
} from "./openapi-test-utils";
import { router } from "./routers";

type OpenAPISchema = {
  $ref?: string;
  type?: "string" | "number" | "integer" | "boolean" | "object" | "array";
  format?: string;
  enum?: unknown[];
  required?: string[];
  properties?: Record<string, OpenAPISchema>;
  items?: OpenAPISchema;
  oneOf?: OpenAPISchema[];
  anyOf?: OpenAPISchema[];
  nullable?: boolean;
};

type OpenAPIParameter = {
  name: string;
  in: "path" | "query" | "header" | "cookie";
  required?: boolean;
  schema?: OpenAPISchema;
  content?: Record<string, { schema?: OpenAPISchema }>;
};

type OpenAPIOperation = {
  parameters?: OpenAPIParameter[];
  requestBody?: {
    content?: Record<string, { schema?: OpenAPISchema }>;
  };
};

type OpenAPIDocument = {
  paths?: Record<string, Record<string, OpenAPIOperation>>;
  components?: {
    schemas?: Record<string, OpenAPISchema>;
  };
};

type BuiltRequestBody = {
  contentType: string;
  body: unknown;
};

const API_PREFIX = "/api";
const BASE_URL = "http://example.local";
const HTTP_METHODS = new Set(["get", "post", "put", "patch", "delete", "options", "head"]);

const buildPath = (template: string, params: Record<string, string>) =>
  template.replace(/\{([^}]+)\}/g, (_, name) => encodeURIComponent(params[name] ?? "1"));

const buildRequestInit = (method: string, requestBody: BuiltRequestBody | null): RequestInit => {
  if (!requestBody) {
    return { method: method.toUpperCase() };
  }

  if (requestBody.body instanceof FormData) {
    return { method: method.toUpperCase(), body: requestBody.body };
  }

  return {
    method: method.toUpperCase(),
    body: JSON.stringify(requestBody.body ?? null),
    headers: { "content-type": requestBody.contentType },
  };
};

const getParamSchema = (param: OpenAPIParameter): OpenAPISchema | undefined => {
  if (param.schema) {
    return param.schema;
  }

  const contentType = Object.keys(param.content ?? {})[0];
  return contentType ? param.content?.[contentType]?.schema : undefined;
};

const buildInvalidParams = (
  operation: OpenAPIOperation,
  document: OpenAPIDocument,
  pathParams: Record<string, string>,
  queryParams: Record<string, string>,
): boolean => {
  const parameters = operation.parameters ?? [];
  for (const param of parameters) {
    if (param.in !== "path" && param.in !== "query") {
      continue;
    }

    const schema = getParamSchema(param);
    const invalidValue = buildInvalidValueFromSchema(schema, document);
    const stringValue = String(invalidValue ?? "invalid");
    if (param.in === "path") {
      pathParams[param.name] = stringValue;
    } else {
      queryParams[param.name] = stringValue;
    }
    return true;
  }

  return false;
};

const buildRequestForOperation = (
  path: string,
  method: string,
  operation: OpenAPIOperation,
  document: OpenAPIDocument,
  useInvalidPayload: boolean,
): Request | null => {
  const pathParams = buildPathParams(operation, document);
  const queryParams = buildQueryParams(operation, document);
  const requestBody = useInvalidPayload
    ? buildInvalidRequestBody(operation, document)
    : buildRequestBody(operation, document);

  if (useInvalidPayload && !requestBody) {
    const didInvalidate = buildInvalidParams(operation, document, pathParams, queryParams);
    if (!didInvalidate) {
      return null;
    }
  }

  const resolvedPath = buildPath(path, pathParams);
  const url = new URL(`${BASE_URL}${API_PREFIX}${resolvedPath}`);
  for (const [key, value] of Object.entries(queryParams)) {
    url.searchParams.set(key, value);
  }

  const init = buildRequestInit(method, requestBody);
  return new Request(url.toString(), init);
};

const collectOperations = (document: OpenAPIDocument) => {
  const operations: Array<{ path: string; method: string; operation: OpenAPIOperation }> = [];

  for (const [path, methods] of Object.entries(document.paths ?? {})) {
    for (const [method, operation] of Object.entries(methods ?? {})) {
      if (!HTTP_METHODS.has(method)) {
        continue;
      }

      operations.push({ path, method, operation });
    }
  }

  return operations;
};

describe("OpenAPI route validation", () => {
  let document: OpenAPIDocument;
  let handler: OpenAPIHandler<any>;

  beforeAll(async () => {
    const mockVehicle = {
      id: 1,
      brand: "Test",
      description: null,
      engine: null,
      model: "Model",
      power: 120,
      trim: null,
      year: 2020,
    };
    const mockOperation = {
      id: 1,
      date: "2020-01-01T00:00:00.000Z",
      mileage: 1000,
      note: null,
      type: "service",
    };
    const mockDocument = {
      id: 1,
      name: "Document",
      date: "2020-01-01T00:00:00.000Z",
      mileage: 1000,
      uri: "https://example.com/doc.pdf",
      note: null,
      type: { name: "Registration" },
    };
    const mockDocumentType = { id: 1, name: "Registration" };

    vi.spyOn(vehicleService, "listVehicle").mockResolvedValue(
      ok([mockVehicle]) as Awaited<ReturnType<typeof vehicleService.listVehicle>>,
    );
    vi.spyOn(vehicleService, "getVehicle").mockResolvedValue(
      ok(mockVehicle) as Awaited<ReturnType<typeof vehicleService.getVehicle>>,
    );
    vi.spyOn(vehicleService, "createVehicle").mockResolvedValue(
      ok(1) as Awaited<ReturnType<typeof vehicleService.createVehicle>>,
    );
    vi.spyOn(vehicleService, "updateVehicle").mockResolvedValue(
      ok() as Awaited<ReturnType<typeof vehicleService.updateVehicle>>,
    );
    vi.spyOn(vehicleService, "removeVehicle").mockResolvedValue(
      ok() as Awaited<ReturnType<typeof vehicleService.removeVehicle>>,
    );

    vi.spyOn(operationService, "listOperations").mockResolvedValue(
      ok([mockOperation]) as Awaited<ReturnType<typeof operationService.listOperations>>,
    );
    vi.spyOn(operationService, "getOperation").mockResolvedValue(
      ok(mockOperation) as Awaited<ReturnType<typeof operationService.getOperation>>,
    );
    vi.spyOn(operationService, "createOperation").mockResolvedValue(
      ok(1) as Awaited<ReturnType<typeof operationService.createOperation>>,
    );
    vi.spyOn(operationService, "updateOperation").mockResolvedValue(
      ok() as Awaited<ReturnType<typeof operationService.updateOperation>>,
    );
    vi.spyOn(operationService, "removeOperation").mockResolvedValue(
      ok() as Awaited<ReturnType<typeof operationService.removeOperation>>,
    );

    vi.spyOn(documentService, "listDocuments").mockResolvedValue(
      ok([mockDocument]) as Awaited<ReturnType<typeof documentService.listDocuments>>,
    );
    vi.spyOn(documentService, "getDocument").mockResolvedValue(
      ok(mockDocument) as Awaited<ReturnType<typeof documentService.getDocument>>,
    );
    vi.spyOn(documentService, "createDocument").mockResolvedValue(
      ok(1) as Awaited<ReturnType<typeof documentService.createDocument>>,
    );
    vi.spyOn(documentService, "updateDocument").mockResolvedValue(
      ok() as Awaited<ReturnType<typeof documentService.updateDocument>>,
    );
    vi.spyOn(documentService, "removeDocument").mockResolvedValue(
      ok() as Awaited<ReturnType<typeof documentService.removeDocument>>,
    );

    vi.spyOn(documentTypeService, "listDocumentTypes").mockResolvedValue(
      ok([mockDocumentType]) as Awaited<ReturnType<typeof documentTypeService.listDocumentTypes>>,
    );

    const generator = new OpenAPIGenerator({
      schemaConverters: [new ZodToJsonSchemaConverter()],
    });
    document = (await generator.generate(router, {
      info: {
        title: "CM3K API",
        version: "1.0.0",
      },
    })) as OpenAPIDocument;

    handler = new OpenAPIHandler(router);
  });

  it("handles valid payloads for all spec operations", async () => {
    const operations = collectOperations(document);

    for (const { path, method, operation } of operations) {
      const request = buildRequestForOperation(path, method, operation, document, false);
      if (!request) {
        continue;
      }

      const result = await handler.handle(request, { context: {} as any, prefix: API_PREFIX });
      if (!result.matched || !result.response) {
        throw new Error(`${method.toUpperCase()} ${path} did not match the handler`);
      }

      expect(result.matched, `${method.toUpperCase()} ${path} should match`).toBe(true);
      expect(result.response.status, `${method.toUpperCase()} ${path} should succeed`).toBeGreaterThanOrEqual(
        200,
      );
      expect(result.response.status, `${method.toUpperCase()} ${path} should succeed`).toBeLessThan(300);
    }
  });

  it("rejects invalid payloads for spec operations", async () => {
    const operations = collectOperations(document);

    for (const { path, method, operation } of operations) {
      const hasInputs = Boolean(operation.requestBody?.content) ||
        (operation.parameters ?? []).some((param) => param.in === "path" || param.in === "query");
      const request = buildRequestForOperation(path, method, operation, document, true);
      if (!request) {
        expect(hasInputs, `${method.toUpperCase()} ${path} has no invalid inputs to test`).toBe(false);
        continue;
      }

      const result = await handler.handle(request, { context: {} as any, prefix: API_PREFIX });
      if (!result.matched || !result.response) {
        throw new Error(`${method.toUpperCase()} ${path} did not match the handler`);
      }

      expect(result.matched, `${method.toUpperCase()} ${path} should match`).toBe(true);
      expect(result.response.status, `${method.toUpperCase()} ${path} should reject`).toBeGreaterThanOrEqual(400);
      expect(result.response.status, `${method.toUpperCase()} ${path} should reject`).toBeLessThan(500);
    }
  });
});
