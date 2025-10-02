import { os } from "@orpc/server";
import * as z from "zod";

const CarSchema = z.object({
  id: z.coerce.number().min(0),
  name: z.string(),
});

const listCars = os
  .route({
    method: "GET",
    path: "/",
  })
  .output(z.array(CarSchema))
  .handler(async () => {
    return [
      {
        id: 12,
        name: "name",
      },
    ];
  });

const findCar = os
  .route({
    method: "GET",
    path: "/{id}",
  })
  .input(CarSchema.pick({ id: true }))
  .output(CarSchema)
  .handler(async ({ input }) => {
    return {
      id: input.id,
      name: "name",
    };
  });

const createCar = os
  .route({
    method: "POST",
    path: "/",
  })
  .input(CarSchema.pick({ name: true }))
  .output(CarSchema)
  .handler(async ({ input }) => {
    return {
      id: 12,
      name: input.name,
    };
  });

export const cars = os.prefix("/cars").router({
  list: listCars,
  find: findCar,
  create: createCar,
});
