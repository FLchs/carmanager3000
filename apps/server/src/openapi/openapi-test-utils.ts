type OpenAPIDocument = {
  components?: {
    schemas?: Record<string, OpenAPISchema>;
  };
};

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

type BuiltRequestBody = {
  contentType: string;
  body: unknown;
};

const DEFAULT_STRING = "example";
const DEFAULT_DATE_TIME = "2020-01-01T00:00:00.000Z";
const DEFAULT_UUID = "00000000-0000-0000-0000-000000000000";
const DEFAULT_EMAIL = "user@example.com";

const INCOMPATIBLE_VALUE_BY_TYPE: Record<NonNullable<OpenAPISchema["type"]>, unknown> = {
  string: 123,
  number: "not-a-number",
  integer: "not-an-integer",
  boolean: "not-a-boolean",
  object: "not-an-object",
  array: "not-an-array",
};

const FORMAT_DEFAULTS: Record<string, string> = {
  "date-time": DEFAULT_DATE_TIME,
  uuid: DEFAULT_UUID,
  email: DEFAULT_EMAIL,
};

const resolveSchema = (schema: OpenAPISchema | undefined, doc: OpenAPIDocument): OpenAPISchema => {
  if (!schema) {
    return {};
  }

  if (schema.$ref) {
    const match = schema.$ref.match(/^#\/components\/schemas\/(.+)$/);
    const refName = match?.[1];
    if (!refName) {
      return {};
    }

    return doc.components?.schemas?.[refName] ?? {};
  }

  return schema;
};

const selectSchemaVariant = (schema: OpenAPISchema): OpenAPISchema => {
  if (schema.oneOf?.length) {
    return schema.oneOf[0] ?? {};
  }
  if (schema.anyOf?.length) {
    return schema.anyOf[0] ?? {};
  }

  return schema;
};

const buildStringValue = (schema: OpenAPISchema): string => {
  if (schema.enum?.length) {
    const value = schema.enum[0];
    return typeof value === "string" ? value : DEFAULT_STRING;
  }

  if (schema.format && FORMAT_DEFAULTS[schema.format]) {
    return FORMAT_DEFAULTS[schema.format];
  }

  return DEFAULT_STRING;
};

const buildValueFromSchema = (schema: OpenAPISchema | undefined, doc: OpenAPIDocument): unknown => {
  const resolved = selectSchemaVariant(resolveSchema(schema, doc));

  if (resolved.enum?.length) {
    return resolved.enum[0];
  }

  switch (resolved.type) {
    case "string":
      return buildStringValue(resolved);
    case "number":
      return 1.23;
    case "integer":
      return 1;
    case "boolean":
      return true;
    case "array":
      return [buildValueFromSchema(resolved.items, doc)];
    case "object":
    default: {
      const properties = resolved.properties ?? {};
      const required = new Set(resolved.required ?? Object.keys(properties));
      const result: Record<string, unknown> = {};

      for (const [key, value] of Object.entries(properties)) {
        if (!required.has(key)) {
          continue;
        }

        result[key] = buildValueFromSchema(value, doc);
      }

      return result;
    }
  }
};

const buildInvalidValueFromSchema = (schema: OpenAPISchema | undefined, doc: OpenAPIDocument): unknown => {
  const resolved = selectSchemaVariant(resolveSchema(schema, doc));

  if (resolved.type === "object" || resolved.properties) {
    const properties = resolved.properties ?? {};
    const required = resolved.required ?? [];

    if (required.length) {
      const invalidObject = buildValueFromSchema(resolved, doc) as Record<string, unknown>;
      delete invalidObject[required[0]];
      return invalidObject;
    }

    const propertyKeys = Object.keys(properties);
    if (propertyKeys.length) {
      const invalidObject = buildValueFromSchema(resolved, doc) as Record<string, unknown>;
      const key = propertyKeys[0];
      invalidObject[key] = INCOMPATIBLE_VALUE_BY_TYPE.string;
      return invalidObject;
    }
  }

  if (resolved.type && INCOMPATIBLE_VALUE_BY_TYPE[resolved.type] !== undefined) {
    return INCOMPATIBLE_VALUE_BY_TYPE[resolved.type];
  }

  return null;
};

const buildParamsFromOperation = (
  operation: OpenAPIOperation,
  doc: OpenAPIDocument,
  location: "path" | "query",
): Record<string, string> => {
  const params = operation.parameters ?? [];
  const result: Record<string, string> = {};

  for (const param of params) {
    if (param.in !== location) {
      continue;
    }

    const schema = param.schema ?? param.content?.[Object.keys(param.content)[0] ?? ""]?.schema;
    const value = buildValueFromSchema(schema, doc);
    result[param.name] = String(value ?? "");
  }

  return result;
};

const buildMultipartFormData = (schema: OpenAPISchema | undefined, doc: OpenAPIDocument): FormData => {
  const resolved = selectSchemaVariant(resolveSchema(schema, doc));
  const properties = resolved.properties ?? {};
  const required = new Set(resolved.required ?? Object.keys(properties));
  const formData = new FormData();

  for (const [key, value] of Object.entries(properties)) {
    if (!required.has(key)) {
      continue;
    }

    const fieldSchema = selectSchemaVariant(resolveSchema(value, doc));
    if (fieldSchema.type === "string" && fieldSchema.format === "binary") {
      const file = new File(["test"], `${key}.txt`, { type: "text/plain" });
      formData.append(key, file);
      continue;
    }

    const fieldValue = buildValueFromSchema(fieldSchema, doc);
    formData.append(key, String(fieldValue ?? ""));
  }

  return formData;
};

const selectRequestBodySchema = (
  operation: OpenAPIOperation,
): { contentType: string; schema: OpenAPISchema | undefined } | null => {
  const content = operation.requestBody?.content;
  if (!content) {
    return null;
  }

  if (content["application/json"]) {
    return { contentType: "application/json", schema: content["application/json"].schema };
  }

  if (content["multipart/form-data"]) {
    return { contentType: "multipart/form-data", schema: content["multipart/form-data"].schema };
  }

  const fallbackType = Object.keys(content)[0];
  if (!fallbackType) {
    return null;
  }

  return { contentType: fallbackType, schema: content[fallbackType]?.schema };
};

export const buildPathParams = (operation: OpenAPIOperation, doc: OpenAPIDocument): Record<string, string> => {
  return buildParamsFromOperation(operation, doc, "path");
};

export const buildQueryParams = (operation: OpenAPIOperation, doc: OpenAPIDocument): Record<string, string> => {
  return buildParamsFromOperation(operation, doc, "query");
};

export const buildRequestBody = (operation: OpenAPIOperation, doc: OpenAPIDocument): BuiltRequestBody | null => {
  const selection = selectRequestBodySchema(operation);
  if (!selection) {
    return null;
  }

  if (selection.contentType === "multipart/form-data") {
    return {
      contentType: selection.contentType,
      body: buildMultipartFormData(selection.schema, doc),
    };
  }

  return {
    contentType: selection.contentType,
    body: buildValueFromSchema(selection.schema, doc),
  };
};

export const buildInvalidRequestBody = (
  operation: OpenAPIOperation,
  doc: OpenAPIDocument,
): BuiltRequestBody | null => {
  const selection = selectRequestBodySchema(operation);
  if (!selection) {
    return null;
  }

  if (selection.contentType === "multipart/form-data") {
    const invalidValue = buildInvalidValueFromSchema(selection.schema, doc);
    if (invalidValue instanceof FormData) {
      return { contentType: selection.contentType, body: invalidValue };
    }

    const formData = new FormData();
    if (invalidValue && typeof invalidValue === "object") {
      for (const [key, value] of Object.entries(invalidValue as Record<string, unknown>)) {
        formData.append(key, String(value ?? ""));
      }
    }

    return { contentType: selection.contentType, body: formData };
  }

  return {
    contentType: selection.contentType,
    body: buildInvalidValueFromSchema(selection.schema, doc),
  };
};

export { buildValueFromSchema, buildInvalidValueFromSchema };
