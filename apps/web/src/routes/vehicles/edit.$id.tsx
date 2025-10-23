import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeftCircleIcon } from "lucide-react";

import EditVehicleForm from "@/components/vehicle/EditVehicleForm";
import { orpc } from "@/lib/orpc";

export const Route = createFileRoute("/vehicles/edit/$id")({
  component: RouteComponent,
  loader: async ({ context: { queryClient }, params: { id } }) => {
    return queryClient.ensureQueryData(
      orpc.vehicles.find.queryOptions({ input: { id: Number(id) } }),
    );
  },
});

function RouteComponent() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data: vehicle } = useSuspenseQuery(
    orpc.vehicles.find.queryOptions({ input: { id: Number(id) } }),
  );
  return (
    <div className="text-text w-full">
      <div className="bg-bg w-full p-4">
        <Link className="flex flex-row gap-2" to={"/vehicles"}>
          <ArrowLeftCircleIcon /> vehicles
        </Link>
      </div>
      <section className="max-w-[800px] p-4">
        <EditVehicleForm
          onCancel={() =>
            navigate({ params: { vehicleId: id }, to: "/vehicles/$vehicleId" })
          }
          onSuccess={() =>
            navigate({ params: { vehicleId: id }, to: "/vehicles/$vehicleId" })
          }
          vehicle={vehicle}
        />
      </section>
    </div>
  );
}
