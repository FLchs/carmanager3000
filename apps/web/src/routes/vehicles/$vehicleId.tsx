import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeftCircleIcon } from "lucide-react";

export const Route = createFileRoute("/vehicles/$vehicleId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { vehicleId } = Route.useParams();

  return (
    <div className="text-text w-full">
      <div className="bg-bg w-full p-4">
        <Link className="flex flex-row gap-2" to="/vehicles">
          <ArrowLeftCircleIcon /> vehicles
        </Link>
      </div>
      <section>Hello "/vehicles/{vehicleId}"!</section>
    </div>
  );
}
