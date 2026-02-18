import { createDocumentSchema } from "@cm3k/validation";
import { isDefinedError } from "@orpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAppForm } from "#/hooks/useForm";
import { openapi } from "#/lib/openapi";

import Modal from "#/components/ui/Modal";
import type { z } from "zod/v4";

export default function NewDocumentModal({
  vehicleId,
  onClose,
  visible,
}: {
  vehicleId: string;
  onClose: () => void;
  visible: boolean;
}) {
  const queryClient = useQueryClient();

  const form = useAppForm({
    defaultValues: {
      name: "",
      date: undefined,
      mileage: undefined,
      file: undefined,
      note: undefined,
      typeId: 0,
    } as z.input<typeof createDocumentSchema>,
    validators: {
      onSubmit: createDocumentSchema,
    },

    onSubmit: async ({ value }) => {
      await mutateAsync({
        body: value,
        params: { vehicleId: Number(vehicleId) },
      });
    },
  });

  const { data: documentTypes } = useQuery(openapi.documentTypes.list.queryOptions({}));

  const { mutateAsync, isPending } = useMutation(
    openapi.vehicles.documents.create.mutationOptions({
      onError: async (error) => {
        if (isDefinedError(error) && error.code === "INPUT_VALIDATION_FAILED") {
          form.setErrorMap({
            onSubmit: {
              fields: error.data.fieldErrors,
            },
          });
        }
      },
      onSuccess: async () => {
        onClose();
        void queryClient.invalidateQueries({
          queryKey: openapi.vehicles.documents.key(),
        });
        form.reset();
      },
    }),
  );

  if (!visible) return null;
  return (
    <Modal>
      <div className="mb-2 flex w-96 flex-col gap-2">
        <h1 className="font-bold">Add a new document</h1>
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
          <form.AppField name="file">
            {(field) => (
              <>
                <field.FileField label="File" />
              </>
            )}
          </form.AppField>
          <form.AppField name="typeId">
            {(field) => (
              <>
                <field.SelectField label="Type" options={documentTypes} required />
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
                <field.TextAreaField label="Note" />
              </>
            )}
          </form.AppField>
          <form.AppForm>
            <p className="ml-auto text-sm text-text-muted">
              fields marked <span className="text-primary">*</span> are required
            </p>
            <div className="flex flex-row justify-end gap-4">
              <form.SubscribeButton callback={onClose} type="button" variant="secondary_outline">
                Cancel
              </form.SubscribeButton>
              <form.SubscribeButton type="submit">Save</form.SubscribeButton>
            </div>
          </form.AppForm>
        </form>
      </div>
    </Modal>
  );
}
