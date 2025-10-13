import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pen, Trash } from "lucide-react";

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
        <span
          className="flex items-center gap-4"
          key={1}
          onClick={() => console.log(id)}
        >
          <Pen size={14} /> Edit
        </span>,
        <span
          className="flex items-center gap-4"
          key={1}
          onClick={() => deleteMutation.mutate({ id })}
        >
          <Trash size={14} /> Delete
        </span>,
      ]}
    />
  );
}

export default VehicleMenu;
