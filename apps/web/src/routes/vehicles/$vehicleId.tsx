import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeftCircleIcon, Trash } from "lucide-react";
import { Suspense, useCallback } from "react";

import { ErrorZone } from "@/components/ErrorZone";
import Button from "@/components/ui/Button";
import InfoCard from "@/components/ui/InfoCard";
import InfoCardItem from "@/components/ui/InfoCard/InfoCardItem";
import { Table } from "@/components/ui/table/Table";
import { useDialog } from "@/hooks/useConfirm";
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
    data: { id, brand, engine, maintenanceLog, model, power, trim, year },
  } = useSuspenseQuery(
    orpc.vehicles.find.queryOptions({ input: { id: Number(vehicleId) } }),
  );

  const { confirm } = useDialog();
  const handleDelete = useCallback(async () => {
    if (await confirm({ title: `Delete ${model} from the database ?` })) {
      console.log("DELETED NIGGA");
    }
  }, [confirm, model]);

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
          <Button callback={handleDelete} variant="secondary_outline">
            <Trash size={18} />
          </Button>
        </div>
      </div>
      <ErrorZone>
        <Suspense fallback={<p>loading...</p>}>
          <main className="flex flex-col p-4 gap-6">
            <header className="m-auto">
              <div className="flex mt-4 flex-row items-center gap-8">
                <img className="h-24" src="/kia-logo.png" />
                <div>
                  <h1 className="font-bold text-text mb-2 text-4xl">
                    {brand} {model}
                  </h1>
                </div>
              </div>
            </header>
            <section>
              <h2 className="text-xl font-bold text-text col-span-2 mb-4">
                Vehicle informations
              </h2>
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
              <h2 className="text-xl text-text col-span-2 mb-4 font-bold">
                Upcoming maintenance
              </h2>
              <div className="bg-bg border-1 border-border rounded-lg">
                <Table
                  rows={[
                    {
                      id: Math.random(),
                      date: "2025-05-27",
                      mileage: 120_000,
                      note: "Castrol",
                      type: "Oil change",
                    },
                  ]}
                  headers={["Date", "Mileage", "Type", "Note"]}
                />
              </div>
            </section>
            <section>
              <h2 className="text-xl text-text col-span-2 mb-4 font-bold">
                Maintenance log
              </h2>
              <div className="bg-bg border-1 border-border rounded-lg">
                <Table
                  headers={["Date", "Mileage", "Note", "Type"]}
                  rows={maintenanceLog}
                />
              </div>
            </section>
          </main>
        </Suspense>
      </ErrorZone>
    </div>
  );
}
