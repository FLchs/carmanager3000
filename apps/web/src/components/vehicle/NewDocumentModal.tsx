import { createDocumentSchema } from "@cm3k/validation";
import { isDefinedError } from "@orpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

import { useAppForm } from "@/hooks/useForm";
import { openapi } from "@/lib/openapi";

import Modal from "../ui/Modal";
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
      date: null as Date | null,
      mileage: null as number | null,
      file: null as File | null,
      note: "",
      typeId: 0,
    },
    validators: {
      onSubmit: createDocumentSchema,
    },
    onSubmit: async ({ value }) => {
      console.log(value);
      createDocumentMutation.mutate({ body: value, params: { vehicleId: Number(vehicleId) } });
    },
  });

  const { data: documentTypes } = useQuery(openapi.documentTypes.list.queryOptions({}));

  const createDocumentMutation = useMutation(
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
      onMutate: async (documentData, context) => {
        const optimisticDocument = {
          id: 0,
          ...documentData.body,
          date: documentData.body.date && format(documentData.body.date, "yyyy-MM-dd"),
          uri: "",
          type: null,
        };
        context.client.setQueryData(
          openapi.vehicles.documents.list.queryKey({
            input: { params: { vehicleId: Number(vehicleId) } },
          }),
          (oldDocuments) => oldDocuments && [...oldDocuments, optimisticDocument],
        );
      },
      onSuccess: async () => {
        form.reset();
        void queryClient.invalidateQueries({
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
                <field.TextField label="Name" />
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
                <field.SelectField label="Type" options={documentTypes} />
              </>
            )}
          </form.AppField>
          <form.AppForm>
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
