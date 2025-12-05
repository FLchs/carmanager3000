import { isDefinedError } from "@orpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { openapi } from "@/lib/openapi";

import { useAppForm } from "../../hooks/useForm";
import Card from "../ui/Card";

function VehicleCreateForm({ cancel }: { cancel: () => void }) {
  const client = useQueryClient();

  const createVehicleMutation = useMutation(
    openapi.vehicles.create.mutationOptions({
      onError: (error) => {
        if (isDefinedError(error) && error.code === "INPUT_VALIDATION_FAILED") {
          form.setErrorMap({
            onSubmit: {
              fields: error.data.fieldErrors,
            },
          });
        }
      },
      onSuccess: async () => {
        form.reset();
        await client.invalidateQueries({
          queryKey: openapi.vehicles.list.key(),
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
    <Card>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="grid gap-4"
      >
        <form.AppField children={(field) => <field.TextField label="Brand" />} name="brand" />
        <form.AppField children={(field) => <field.TextField label="Model" />} name="model" />
        <form.AppField children={(field) => <field.TextField label="Trim" />} name="trim" />
        <form.AppField children={(field) => <field.TextField label="Engine" />} name="engine" />
        <form.AppField children={(field) => <field.NumberField label="Power" />} name="power" />
        <form.AppField children={(field) => <field.NumberField label="Year" />} name="year" />
        <form.AppForm>
          <div className="flex flex-row gap-4">
            <form.SubscribeButton type="submit">Save</form.SubscribeButton>
            <form.SubscribeButton callback={cancel} type="button" variant="secondary_outline">
              Cancel
            </form.SubscribeButton>
          </div>
        </form.AppForm>
      </form>
    </Card>
  );
}

export default VehicleCreateForm;
