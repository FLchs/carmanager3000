import type { ComponentProps } from "react";

const variants = {
  primary: "bg-primary hover:bg-primary-dark border-border  text-text",
  secondary: "bg-secondary hover:bg-secondary-dark border-border  text-text",
  secondary_outline: "border-border  text-text hover:bg-bg-light bg-bg",
  primary_outline:
    "border-primary hover:border-primary-dark hover:text-text hover:bg-primary-dark bg-bg text-primary",
};

type Props = {
  callback?: () => Promise<void> | void;
  variant?: keyof typeof variants;
};

function Button({
  callback,
  variant = "primary",
  ...props
}: ComponentProps<"button"> & Props) {
  return (
    <button
      {...props}
      className={`rounded-lg px-4 py-1.5 border-1 hover:cursor-pointer ${variants[variant]} font-semibold `}
      onClick={callback}
      type={props.type ?? "button"}
    />
  );
}

export default Button;
