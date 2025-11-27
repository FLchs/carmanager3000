import {
  onError,
  ORPCError,
  RouterClient,
  ValidationError,
} from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import * as z from "zod/v4";

import { migrateDb } from "./db";
import { router } from "./routers";

// Ensure database is up to date the server
migrateDb();

const app = new Hono();

const handler = new RPCHandler(router, {
  clientInterceptors: [
    onError((error) => {
      if (
        error instanceof ORPCError &&
        error.code === "BAD_REQUEST" &&
        error.cause instanceof ValidationError
      ) {
        const zodError = new z.ZodError(
          error.cause.issues as z.core.$ZodIssue[],
        );

        throw new ORPCError("INPUT_VALIDATION_FAILED", {
          cause: error.cause,
          data: z.flattenError(zodError),
          message: z.prettifyError(zodError),
          status: 422,
        });
      }
    }),
  ],
});

app.use(logger());
app.use(
  "/*",
  cors({
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "OPTIONS"],
    credentials: true,
    origin: process.env.CORS_ORIGIN || "",
  }),
);

app.use("/rpc/*", async (c, next) => {
  const { matched, response } = await handler.handle(c.req.raw, {
    context: {}, // Provide initial context if needed
    prefix: "/rpc",
  });

  if (matched) {
    return c.newResponse(response.body, response);
  }

  await next();
});

export default app;

export type Client = RouterClient<typeof router>;
