import type { z } from "zod/v4";

import { getVehicleSchema, updateVehicleSchema } from "@cm3k/validation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { openapi } from "#/lib/openapi";

import { useAppForm } from "#/hooks/useForm";

type VehicleEditData = z.infer<typeof getVehicleSchema>;
type VehicleUpdateBody = z.input<typeof updateVehicleSchema>;

function VehicleEditForm({
  onCancel,
  onSuccess,
  vehicle,
}: {
  onCancel: () => void;
  onSuccess: () => void;
  vehicle: VehicleEditData;
}) {
  const client = useQueryClient();

  const editVehicleMutation = useMutation(
    openapi.vehicles.update.mutationOptions({
      onSuccess: async () => {
        await client.invalidateQueries({
          queryKey: openapi.vehicles.get.key(),
        });
        onSuccess();
      },
    }),
  );

  const form = useAppForm({
    defaultValues: {
      brand: vehicle.brand,
      model: vehicle.model,
      trim: vehicle.trim ?? "",
      engine: vehicle.engine ?? "",
      power: vehicle.power ?? "",
      year: vehicle.year ?? "",
    } satisfies VehicleUpdateBody,
    onSubmit: async ({ value }) => {
      editVehicleMutation.mutate({ body: value, params: { id: vehicle.id } });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="grid gap-4"
    >
      <form.AppField name="brand">{(field) => <field.TextField label="Brand" />}</form.AppField>
      <form.AppField name="model">{(field) => <field.TextField label="Model" />}</form.AppField>
      <form.AppField name="trim">{(field) => <field.TextField label="Trim" />}</form.AppField>
      <form.AppField name="engine">{(field) => <field.TextField label="Engine" />}</form.AppField>
      <form.AppField name="power">{(field) => <field.NumberField label="Power" />}</form.AppField>
      <form.AppField name="year">{(field) => <field.NumberField label="Year" />}</form.AppField>
      <form.AppForm>
        <div className="flex flex-row gap-4">
          <form.SubscribeButton type="submit">Save</form.SubscribeButton>
          <form.SubscribeButton callback={onCancel} type="button" variant="secondary_outline">
            Cancel
          </form.SubscribeButton>
        </div>
      </form.AppForm>
    </form>
  );
}

export default VehicleEditForm;
