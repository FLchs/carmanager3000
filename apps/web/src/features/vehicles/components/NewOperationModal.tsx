import type { z } from "zod/v4";

import { createOperationSchema } from "@cm3k/validation";
import { isDefinedError } from "@orpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAppForm } from "#/hooks/useForm";
import { openapi } from "#/lib/openapi";

import Modal from "#/components/ui/Modal";
export default function NewOperationModal({
  id,
  onClose,
  visible,
}: {
  id: string;
  onClose: () => void;
  visible: boolean;
}) {
  const client = useQueryClient();

  const form = useAppForm({
    defaultValues: {
      name: "",
      date: undefined,
      mileage: undefined,
      note: undefined,
      type: "",
    } as z.infer<typeof createOperationSchema>,
    validators: {
      onSubmit: createOperationSchema,
    },
    onSubmit: async ({ value }) => {
      createOperationMutation.mutate({ body: value, params: { vehicleId: Number(id) } });
    },
  });

  const createOperationMutation = useMutation(
    openapi.vehicles.operations.create.mutationOptions({
      onError: async (error) => {
        if (isDefinedError(error) && error.code === "INPUT_VALIDATION_FAILED") {
          form.setErrorMap({
            onSubmit: {
              fields: error.data.fieldErrors,
            },
          });
        }
      },
      onMutate: async (log, context) => {
        const tempItem = {
          id: 0,
          ...log.body,
          date: log.body.date ?? null,
          mileage: log.body.mileage ?? null,
          note: log.body.note ?? null,
        };
        context.client.setQueryData(
          openapi.vehicles.operations.list.queryKey({
            input: { params: { vehicleId: Number(id) } },
          }),
          (old) => old && [...old, tempItem],
        );
      },
      onSuccess: async () => {
        form.reset();
        void client.invalidateQueries({
          queryKey: openapi.vehicles.operations.key(),
        });
        onClose();
      },
    }),
  );

  if (!visible) return null;
  return (
    <Modal>
      <div className="mb-2 flex flex-col gap-2">
        <h1 className="font-bold">Add new log entry</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="grid gap-4"
        >
          <form.AppField name="name">
            {(field) => (
              <>
                <field.TextField label="Name" required />
              </>
            )}
          </form.AppField>
          <form.AppField name="date">
            {(field) => (
              <>
                <field.DateField label="Date" />
              </>
            )}
          </form.AppField>
          <form.AppField name="mileage">
            {(field) => (
              <>
                <field.NumberField label="Mileage" />
              </>
            )}
          </form.AppField>
          <form.AppField name="note">
            {(field) => (
              <>
                <field.TextField label="Note" />
              </>
            )}
          </form.AppField>
          <form.AppField name="type">
            {(field) => (
              <>
                <field.TextField label="Type" required />
              </>
            )}
          </form.AppField>
          <form.AppForm>
            <div className="flex flex-row gap-4">
              <form.SubscribeButton type="submit">Save</form.SubscribeButton>
              <form.SubscribeButton callback={onClose} type="button" variant="secondary_outline">
                Cancel
              </form.SubscribeButton>
            </div>
          </form.AppForm>
        </form>
      </div>
    </Modal>
  );
}
