import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeftCircleIcon, Trash } from "lucide-react";
import { Suspense, useCallback } from "react";

import { ErrorZone } from "@/components/ErrorZone";
import Button from "@/components/ui/Button";
import InfoCard from "@/components/ui/InfoCard";
import InfoCardItem from "@/components/ui/InfoCard/InfoCardItem";
import OperationTable from "@/components/vehicle/OperationsTable";
import { useDialog } from "@/hooks/useConfirm";
import { openapi } from "@/lib/openapi";

export const Route = createFileRoute("/vehicles/$vehicleId")({
  component: RouteComponent,
  loader: async ({ context: { queryClient }, params: { vehicleId } }) => {
    return queryClient.ensureQueryData(
      openapi.vehicles.get.queryOptions({ input: { id: Number(vehicleId) } }),
    );
  },
});

function RouteComponent() {
  const { vehicleId } = Route.useParams();
  const {
    data: { id, brand, engine, model, power, trim, year },
  } = useSuspenseQuery(openapi.vehicles.get.queryOptions({ input: { id: Number(vehicleId) } }));

  const { confirm } = useDialog();
  const handleDelete = useCallback(async () => {
    if (await confirm({ title: `Delete ${model} from the database ?` })) {
      console.log("DELETED");
    }
  }, [confirm, model]);

  return (
    <div className="text-text w-full">
      <div className="bg-bg flex w-full flex-row items-center justify-between p-4 align-middle">
        <Link className="block" to="/vehicles">
          <ArrowLeftCircleIcon className="inline" /> vehicles
        </Link>
        <div className="flex flex-row gap-2">
          <Link params={{ id: id.toString() }} to={"/vehicles/edit/$id"}>
            <Button>Edit</Button>
          </Link>
          <Button callback={handleDelete} variant="secondary_outline">
            <Trash size={18} />
          </Button>
        </div>
      </div>
      <ErrorZone>
        <Suspense fallback={<p>loading...</p>}>
          <main className="flex flex-col gap-6 p-4">
            <header className="m-auto">
              <div className="mt-4 flex flex-row items-center gap-8">
                <img className="h-24" src="/kia-logo.png" />
                <div>
                  <h1 className="text-text mb-2 text-4xl font-bold">
                    {brand} {model}
                  </h1>
                </div>
              </div>
            </header>
            <section>
              <h2 className="text-text col-span-2 mb-4 text-xl font-bold">Vehicle informations</h2>
              <div className="grid grid-cols-2 gap-4">
                <InfoCard>
                  <InfoCardItem name="Registration year" value={year} />
                  <InfoCardItem name="Power" value={power} />
                  <InfoCardItem name="Trim" value={trim} />
                  <InfoCardItem name="Engine" value={engine} />
                </InfoCard>
                <img className="rounded-lg" src="/kia-magentis.jpg" />
              </div>
            </section>
            <section className="hidden">
              <h2 className="text-text col-span-2 mb-4 text-xl font-bold">Upcoming maintenance</h2>
              <div className="bg-bg border-border rounded-lg border-1"></div>
            </section>
            <section>
              <h2 className="text-text col-span-2 mb-4 text-xl font-bold">Maintenance log</h2>
              <div className="bg-bg border-border rounded-lg border-1">
                <Suspense fallback={<p>Loading...</p>}>
                  <OperationTable id={id} />
                </Suspense>
              </div>
            </section>
          </main>
        </Suspense>
      </ErrorZone>
    </div>
  );
}
