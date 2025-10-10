import type { ComponentProps } from "react";

type Props = {
  callback?: () => Promise<void> | void;
};

function Button({ callback, ...props }: ComponentProps<"button"> & Props) {
  return (
    <button
      {...props}
      className="rounded-lg px-4 py-2 bg-bg border-border border-1 text-text hover:bg-bg-light hover:cursor-pointer"
      onClick={callback}
      type={props.type ?? "button"}
    />
  );
}

export default Button;
