import pino from "pino";
import pretty from "pino-pretty";

export default pino(
  {
    level: "error",
    // transport: { target: "hono-pino/debug-log", options: { colorEnabled: true } },
    timestamp: pino.stdTimeFunctions.unixTime,
  },
  pretty({ colorize: true }),
);
