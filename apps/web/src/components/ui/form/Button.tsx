import type { ComponentProps } from "react";

import { useFormContext } from "../../../contexts/form-context";
import Button from "../Button";

type FormButtonProps = ComponentProps<typeof Button>;

export function SubscribeButton(props: FormButtonProps) {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => <Button disabled={isSubmitting} {...props} />}
    </form.Subscribe>
  );
}
