import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeftCircleIcon, Trash } from "lucide-react";
import { Suspense } from "react";

import { ErrorZone } from "@/components/ErrorZone";
import Button from "@/components/ui/Button";
import { orpc } from "@/lib/orpc";

export const Route = createFileRoute("/vehicles/$vehicleId")({
  component: RouteComponent,
  loader: async ({ context: { queryClient }, params: { vehicleId } }) => {
    return queryClient.ensureQueryData(
      orpc.vehicles.find.queryOptions({ input: { id: Number(vehicleId) } }),
    );
  },
});

function RouteComponent() {
  const { vehicleId } = Route.useParams();
  const {
    data: { id, brand, engine, model, power, trim, year },
  } = useSuspenseQuery(
    orpc.vehicles.find.queryOptions({ input: { id: Number(vehicleId) } }),
  );
  return (
    <div className="text-text w-full">
      <div className="bg-bg w-full p-4 flex flex-row justify-between align-middle items-center">
        <Link className="block" to="/vehicles">
          <ArrowLeftCircleIcon className="inline" /> vehicles
        </Link>
        <div className="flex flex-row gap-2">
          <Link params={{ id: id.toString() }} to={"/vehicles/edit/$id"}>
            <Button>Edit</Button>
          </Link>
          <Button variant="secondary_outline">
            <Trash size={18} />
          </Button>
        </div>
      </div>
      <ErrorZone>
        <Suspense fallback={<p>loading...</p>}>
          <section className="p-4 max-w-[800px]">
            <div className="w-full bg-bg-light relative">
              <img className="h-12 absolute" src="/kia-logo.png" />
              <img className="w-full" src="/kia-magentis.jpg" />
            </div>
            <div className="flex gap-4 mt-4 justify-between">
              <div>
                <h3 className="font-bold text-text mb-2">{model}</h3>
                <p className="text-text-muted">
                  {brand} {model} {trim} - {year}
                </p>
                <p className="text-text-muted">
                  {engine} - {power}
                </p>
              </div>
            </div>
          </section>
        </Suspense>
      </ErrorZone>
    </div>
  );
}
