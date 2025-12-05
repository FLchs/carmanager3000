import type { ComponentProps } from "react";

function Card(props: ComponentProps<"div">) {
  return <div {...props} className="bg-bg border-border text-text rounded-2xl border-1 p-4" />;
}

export default Card;
