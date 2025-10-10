import type { ComponentProps } from "react";

function Card(props: ComponentProps<"div">) {
  return (
    <div {...props} className="rounded-2xl p-4 bg-bg border-border border-1" />
  );
}

export default Card;
