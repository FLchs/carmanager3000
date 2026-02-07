import { OpenAPIGenerator } from "@orpc/openapi";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { router } from "./routers";

const outputPath = fileURLToPath(new URL("../openapi.json", import.meta.url));

const generator = new OpenAPIGenerator({
  schemaConverters: [new ZodToJsonSchemaConverter()],
});

try {
  const document = await generator.generate(router, {
    info: {
      title: "CM3K API",
      version: "1.0.0",
    },
  });

  await writeFile(outputPath, JSON.stringify(document, null, 2));
  console.log(`OpenAPI document written to ${outputPath}`);
} catch (error) {
  console.error("Failed to generate OpenAPI document.");
  console.error(error);
  process.exitCode = 1;
}
