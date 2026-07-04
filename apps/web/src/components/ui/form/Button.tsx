import type { ComponentProps } from "react";

import { useFormContext } from "../../../contexts/form-context";
import Button from "../Button";
import { LoaderCircleIcon } from "lucide-react";

type FormButtonProps = ComponentProps<typeof Button>;

export function SubscribeButton(props: FormButtonProps) {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button disabled={isSubmitting} {...props}>
          {isSubmitting && props.type === "submit" ? (
            <LoaderCircleIcon className="h-6 animate-spin text-text-muted" />
          ) : (
            props.children
          )}
        </Button>
      )}
    </form.Subscribe>
  );
}
