import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAppForm } from "../../hooks/useForm";
import { orpc } from "../../lib/orpc";

function VehicleCreateForm() {
  const client = useQueryClient();

  const createVehicleMutation = useMutation(
    orpc.vehicles.create.mutationOptions({
      onSuccess: async () => {
        form.reset();
        await client.invalidateQueries({
          queryKey: orpc.vehicles.list.key(),
        });
      },
    }),
  );

  const form = useAppForm({
    defaultValues: {
      brand: "",
      engine: "",
      model: "",
      power: 0,
      trim: "",
      year: 2012,
    },
    onSubmit: async ({ value }) => {
      createVehicleMutation.mutate(value);
    },
  });

  return (
    <div className="rounded-2xl p-4 bg-elevated border-highlight border-1">
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
          <form.SubscribeButton label="Submit" type="submit" />
        </form.AppForm>
      </form>
    </div>
  );
}

export default VehicleCreateForm;
