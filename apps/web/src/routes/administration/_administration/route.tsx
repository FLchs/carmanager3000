import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/administration/_administration")({
  component: RouteComponent,
  staticData: {
    getTitle: () => "Administration",
  },
});

function RouteComponent() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
