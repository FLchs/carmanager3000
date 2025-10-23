import type { RefObject } from "react";

import Button from "./Button";
import Card from "./Card";

type Props = {
  onCancel?: () => void;
  onConfirm: () => void;
  ref: RefObject<HTMLDialogElement | null>;
  subTitle?: string;
  title: string;
};

function Dialog({ onCancel, onConfirm, ref, title }: Props) {
  return (
    <dialog className="m-auto bg-transparent backdrop:bg-transparent" ref={ref}>
      <Card>
        <div className="flex flex-col gap-4">
          {title}
          <div className="flex flex-row justify-end gap-4">
            <Button callback={onCancel} variant="secondary_outline">
              Cancel
            </Button>
            <Button callback={onConfirm}>Ok</Button>
          </div>
        </div>
      </Card>
    </dialog>
  );
}

export default Dialog;
