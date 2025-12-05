import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAppForm } from "@/hooks/useForm";
import { openapi } from "@/lib/openapi";

import Modal from "../ui/Modal";
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

  const createVehicleMutation = useMutation(
    openapi.vehicles.operations.create.mutationOptions({
      onError: async () => {
        void client.invalidateQueries({
          queryKey: openapi.vehicles.get.key(),
        });
      },
      onMutate: async (log, context) => {
        onClose();
        const tempItem = {
          id: 0,
          createdAt: "",
          updatedAt: "",
          ...log,
        };
        context.client.setQueryData(
          openapi.operations.list.queryKey({
            input: { query: { vehicleId: Number(id) } },
          }),
          (old) => old && [...old, tempItem],
        );
      },
      onSuccess: async () => {
        form.reset();
        void client.invalidateQueries({
          queryKey: openapi.vehicles.operations.key(),
        });
      },
    }),
  );

  const form = useAppForm({
    defaultValues: {
      date: new Date(),
      mileage: 0,
      note: "",
      type: "",
    },
    onSubmit: async ({ value }) => {
      createVehicleMutation.mutate({ vehicleId: Number(id), ...value });
    },
  });

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
          <form.AppField children={(field) => <field.DateField label="Date" />} name="date" />
          <form.AppField
            children={(field) => <field.NumberField label="Mileage" />}
            name="mileage"
          />
          <form.AppField children={(field) => <field.TextField label="Note" />} name="note" />
          <form.AppField children={(field) => <field.TextField label="Type" />} name="type" />
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
