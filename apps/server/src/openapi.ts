import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { onError } from "@orpc/server";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { logger } from "hono/logger";
import { absolutePath } from "swagger-ui-dist";

import { router } from "./routers";

const app = new Hono();
app.use(logger());

app.use("/docs/*", async (c, next) => {
  const { matched, response } = await handler.handle(c.req.raw, {
    context: {}, // Provide initial context if needed
    prefix: "/docs",
  });

  if (matched) {
    return c.newResponse(response.body, response);
  }

  await next();
});

const handler = new OpenAPIHandler(router, {
  interceptors: [
    onError((error) => {
      console.error(error);
      console.log(error);
    }),
  ],
  plugins: [
    new OpenAPIReferencePlugin({
      docsCssUrl: "/docs/static/index.css",
      docsPath: "/",
      docsProvider: "swagger",
      docsScriptUrl: "/docs/static/swagger.js",
      schemaConverters: [new ZodToJsonSchemaConverter()],
    }),
  ],
});

app.use(
  "/docs/static/index.css",
  serveStatic({
    path: "swagger-ui.css", // file inside that directory
    root: absolutePath(), // directory
  }),
);
app.use(
  "/docs/static/swagger.js",
  serveStatic({
    path: "swagger-ui-bundle.js", // file inside that directory
    root: absolutePath(), // directory
  }),
);

export default app;
