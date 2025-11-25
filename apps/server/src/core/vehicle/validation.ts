import { vehicles } from "#db/schemas/vehicle";
import { createSchemaFactory } from "drizzle-zod";

// TODO: replace with custom made schemas that could be used both sides

const { createInsertSchema, createSelectSchema } = createSchemaFactory({
  coerce: {
    // date: true,
    number: true,
  },
});

export const vehicleSchema = createSelectSchema(vehicles);
export const vehicleInsertSchema = createInsertSchema(vehicles, {
  brand: (schema) => schema.min(1),
  model: (schema) => schema.min(1),
}).omit({ createdAt: true, updatedAt: true });
