import Header from "#/components/ui/Header";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/administration/_administration/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Header>Hello</Header>
      Hello "/administration/"!
    </div>
  );
}
