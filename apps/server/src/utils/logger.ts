import pino from "pino";
import pretty from "pino-pretty";

export const httpPino = pino(
  {
    level: "info",
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  pretty({
    colorize: true,
    messageFormat: "{req.method} {req.url} {res.status} - {responseTime}ms",
    ignore: "req,res,reqId,responseTime,hostname",
  }),
);

export const logger = pino({
  level: "error",
  timestamp: pino.stdTimeFunctions.isoTime,
});
