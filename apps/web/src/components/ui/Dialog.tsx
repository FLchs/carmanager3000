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
    <dialog className="m-auto backdrop:bg-transparent bg-transparent" ref={ref}>
      <Card>
        <div className="flex flex-col gap-4">
          {title}
          <div className="flex flex-row gap-4 justify-end">
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
