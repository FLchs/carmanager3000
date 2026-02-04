import type { AnyFieldApi } from "@tanstack/react-form";

import { isDefinedError } from "@orpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { openapi } from "@/lib/openapi";

import { useAppForm } from "@/hooks/useForm";
import Card from "@/components/ui/Card";

function VehicleCreateForm({ cancel }: { cancel: () => void }) {
  const client = useQueryClient();

  const createVehicleMutation = useMutation(
    openapi.vehicles.create.mutationOptions({
      onError: (error) => {
        if (isDefinedError(error) && error.code === "INPUT_VALIDATION_FAILED") {
          console.table(error.data.fieldErrors);
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
      description: "",
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
        <form.AppField name="brand">
          {(field) => (
            <>
              <field.TextField label="Brand" />
              <FieldInfo field={field} />
            </>
          )}
        </form.AppField>
        <form.AppField name="model">
          {(field) => (
            <>
              <field.TextField label="Model" />
              <FieldInfo field={field} />
            </>
          )}
        </form.AppField>
        <form.AppField name="trim">
          {(field) => (
            <>
              <field.TextField label="Trim" />
              <FieldInfo field={field} />
            </>
          )}
        </form.AppField>
        <form.AppField name="engine">
          {(field) => (
            <>
              <field.TextField label="Engine" />
              <FieldInfo field={field} />
            </>
          )}
        </form.AppField>
        <form.AppField name="power">
          {(field) => (
            <>
              <field.NumberField label="Power" />
              <FieldInfo field={field} />
            </>
          )}
        </form.AppField>
        <form.AppField name="year">
          {(field) => (
            <>
              <field.NumberField label="Year" />
              <FieldInfo field={field} />
            </>
          )}
        </form.AppField>
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

function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em>{field.state.meta.errors.join(",")}</em>
      ) : null}
      {field.state.meta.isValidating ? "Validating..." : null}
    </>
  );
}
