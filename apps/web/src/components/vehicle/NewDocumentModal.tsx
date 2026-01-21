import { createDocumentSchema } from "@cm3k/validation";
import { isDefinedError } from "@orpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { type z } from "zod/v4";

import { useAppForm } from "@/hooks/useForm";
import { openapi } from "@/lib/openapi";

import Modal from "../ui/Modal";
export default function NewDocumentModal({
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
      date: new Date(),
      mileage: 0,
      file: new File([], "", undefined),
      note: "",
      type: "cover" as "cover",
    } as z.infer<typeof createDocumentSchema>,
    validators: {
      onChange: createDocumentSchema,
    },
    onSubmit: async ({ value }) => {
      createVehicleMutation.mutate({ body: value, params: { vehicleId: Number(id) } });
    },
  });

  const createVehicleMutation = useMutation(
    openapi.vehicles.documents.create.mutationOptions({
      onError: async (error) => {
        if (isDefinedError(error) && error.code === "INPUT_VALIDATION_FAILED") {
          console.table(error.data.fieldErrors);
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
          date: format(log.body.date, "yyyy-MM-dd"),
          uri: "",
        };
        context.client.setQueryData(
          openapi.vehicles.documents.list.queryKey({
            input: { params: { vehicleId: Number(id) } },
          }),
          (old) => old && [...old, tempItem],
        );
      },
      onSuccess: async () => {
        form.reset();
        void client.invalidateQueries({
          queryKey: openapi.vehicles.documents.key(),
        });
        onClose();
      },
    }),
  );

  if (!visible) return;
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
          <form.AppField name="file">
            {(field) => (
              <>
                <field.FileField label="File" />
              </>
            )}
          </form.AppField>
          <form.AppField name="type">
            {(field) => (
              <>
                <field.TextField label="Type" />
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
