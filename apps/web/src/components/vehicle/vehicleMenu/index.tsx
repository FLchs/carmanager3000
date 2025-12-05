import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Pen, Trash } from "lucide-react";
import { useCallback, useRef, useState } from "react";

import PopoverContent from "@/components/ui/Popover";
import { useDialog } from "@/hooks/useConfirm";
import { openapi } from "@/lib/openapi";

import Content from "./Content";

export default function VehicleMenu({ id }: { id: number }) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const { confirm } = useDialog();

  const toggle = useCallback(() => setOpen((v) => !v), []);

  const client = useQueryClient();
  const navigate = useNavigate();

  const deleteMutation = useMutation(
    openapi.vehicles.remove.mutationOptions({
      onSuccess: async () => {
        await client.invalidateQueries({
          queryKey: openapi.vehicles.list.key(),
        });
      },
    }),
  );

  const onDelete = useCallback(async () => {
    if (await confirm({ title: "Do you really want to delete this vehicle ?" })) {
      deleteMutation.mutate({ id });
    }
  }, [confirm, deleteMutation, id]);

  return (
    <div>
      <button
        className="text-text-muted cursor-pointer hover:text-white"
        onClick={toggle}
        ref={btnRef}
        type="button"
      >
        ⠇
      </button>
      {open && (
        <PopoverContent anchorRef={btnRef} onClose={() => setOpen(false)}>
          <Content
            items={[
              <span
                onClick={() =>
                  navigate({
                    params: { id: id.toString() },
                    to: "/vehicles/edit/$id",
                  })
                }
                className="flex items-center gap-4"
                key={1}
              >
                <Pen size={14} /> Edit
              </span>,
              <span className="flex items-center gap-4" key={1} onClick={onDelete}>
                <Trash size={14} /> Delete
              </span>,
            ]}
          />
        </PopoverContent>
      )}
    </div>
  );
}
