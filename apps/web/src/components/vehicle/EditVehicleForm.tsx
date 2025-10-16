import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAppForm } from "../../hooks/useForm";
import { orpc } from "../../lib/orpc";

interface VehicleData {
  brand: string;
  engine: null | string;
  id: number;
  model: string;
  power: null | number;
  trim: null | string;
  year: null | number;
}

function EditVehicleForm({
  onCancel,
  onSuccess,
  vehicle,
}: {
  onCancel: () => void;
  onSuccess: () => void;
  vehicle: VehicleData;
}) {
  const client = useQueryClient();

  const editVehicleMutation = useMutation(
    orpc.vehicles.edit.mutationOptions({
      onSuccess: async () => {
        await client.invalidateQueries({
          queryKey: orpc.vehicles.find.key(),
        });
        onSuccess();
      },
    }),
  );

  const form = useAppForm({
    defaultValues: {
      ...vehicle,
    },
    onSubmit: async ({ value }) => {
      editVehicleMutation.mutate(value);
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
      <form.AppField
        children={(field) => <field.TextField label="Brand" />}
        name="brand"
      />
      <form.AppField
        children={(field) => <field.TextField label="Model" />}
        name="model"
      />
      <form.AppField
        children={(field) => <field.TextField label="Trim" />}
        name="trim"
      />
      <form.AppField
        children={(field) => <field.TextField label="Engine" />}
        name="engine"
      />
      <form.AppField
        children={(field) => <field.NumberField label="Power" />}
        name="power"
      />
      <form.AppField
        children={(field) => <field.NumberField label="Year" />}
        name="year"
      />
      <form.AppForm>
        <div className="flex flex-row gap-4">
          <form.SubscribeButton type="submit">Save</form.SubscribeButton>
          <form.SubscribeButton
            callback={onCancel}
            type="button"
            variant="secondary_outline"
          >
            Cancel
          </form.SubscribeButton>
        </div>
      </form.AppForm>
    </form>
  );
}

export default EditVehicleForm;
