import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAppForm } from "@/hooks/useForm";
import { orpc } from "@/lib/orpc";

import Modal from "../ui/Modal";
function NewLogModal({
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
    orpc.vehicles.logs.create.mutationOptions({
      onError: async () => {
        void client.invalidateQueries({
          queryKey: orpc.vehicles.find.key(),
        });
      },
      onMutate: async (log, context) => {
        try {
          onClose();
          const tempItem = { id: 0, ...log.body };
          context.client.setQueryData(
            orpc.vehicles.logs.find.queryKey({ input: { id: Number(id) } }),
            (old) => old && [...old, tempItem],
          );
        } catch (error) {
          console.error("Optimistic update failed:", error);
        }
      },
      onSuccess: async () => {
        form.reset();
        void client.invalidateQueries({
          queryKey: orpc.vehicles.logs.find.key(),
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
      createVehicleMutation.mutate({ body: value, params: { id } });
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
          <form.AppField
            children={(field) => <field.DateField label="Date" />}
            name="date"
          />
          <form.AppField
            children={(field) => <field.NumberField label="Mileage" />}
            name="mileage"
          />
          <form.AppField
            children={(field) => <field.TextField label="Note" />}
            name="note"
          />
          <form.AppField
            children={(field) => <field.TextField label="Type" />}
            name="type"
          />
          <form.AppForm>
            <div className="flex flex-row gap-4">
              <form.SubscribeButton type="submit">Save</form.SubscribeButton>
              <form.SubscribeButton
                callback={onClose}
                type="button"
                variant="secondary_outline"
              >
                Cancel
              </form.SubscribeButton>
            </div>
          </form.AppForm>
        </form>
      </div>
    </Modal>
  );
}

export default NewLogModal;
