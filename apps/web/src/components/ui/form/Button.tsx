import { useFormContext } from "../../../contexts/form-context";

export function SubscribeButton({
  label,
  type = "button",
}: {
  label: string;
  type?: HTMLButtonElement["type"];
}) {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <button
          className="bg-highlight justify-self-start px-4 py-2 rounded-lg hover:bg-elevated hover:border-highlight border-1 hover:cursor-pointer border-surface"
          disabled={isSubmitting}
          type={type}
        >
          {label}
        </button>
      )}
    </form.Subscribe>
  );
}
