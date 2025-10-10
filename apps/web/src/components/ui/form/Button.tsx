import { useFormContext } from "../../../contexts/form-context";
import Button from "../Button";

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
        <Button disabled={isSubmitting} type={type}>
          {label}
        </Button>
      )}
    </form.Subscribe>
  );
}
