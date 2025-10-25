import { vehiclesRouter as vr2 } from "./maintenance";
import { vehiclesRouter } from "./vehicles";

export const router = {
  vehicles: { ...vehiclesRouter, ...vr2 },
};
