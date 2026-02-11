import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/administration/_administration/document-types")({
  component: RouteComponent,
  staticData: {
    getTitle: () => "Documents types",
  },
});

function RouteComponent() {
  return (
    <>
      <Outlet />
    </>
  );
}
