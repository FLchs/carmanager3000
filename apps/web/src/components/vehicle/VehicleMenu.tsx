import { useMutation, useQueryClient } from "@tanstack/react-query";

import { orpc } from "../../lib/orpc";
import Menu from "../ui/Menu";

function VehicleMenu({ id }: { id: number }) {
  const client = useQueryClient();

  const deleteMutation = useMutation(
    orpc.vehicles.delete.mutationOptions({
      onSuccess: async () => {
        await client.invalidateQueries({
          queryKey: orpc.vehicles.list.key(),
        });
      },
    }),
  );

  return (
    <Menu
      items={[
        { callback: () => deleteMutation.mutate({ id }), label: "delete" },
      ]}
    />
  );
}

export default VehicleMenu;
