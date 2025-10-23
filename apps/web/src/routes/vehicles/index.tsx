import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense, useState } from "react";

import { ErrorZone } from "@/components/ErrorZone";
import Button from "@/components/ui/Button";
import Vehicle from "@/components/vehicle/Vehicle";
import VehicleCreateForm from "@/components/vehicle/VehicleCreateForm";
import { orpc } from "@/lib/orpc";

export const Route = createFileRoute("/vehicles/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [showNewVehicleForm, setShowNewVehicleForm] = useState(false);
  return (
    <div className="p-4">
      <ErrorZone>
        <div className="m-auto flex w-[800px] flex-col gap-4">
          <div className="flex flex-row justify-between">
            <h1 className="font-bold">Vehicles</h1>
            {!showNewVehicleForm && (
              <Button
                callback={() => setShowNewVehicleForm(!showNewVehicleForm)}
                variant="primary_outline"
              >
                Add
              </Button>
            )}
          </div>
          {showNewVehicleForm && (
            <VehicleCreateForm cancel={() => setShowNewVehicleForm(false)} />
          )}
          <Suspense fallback={<p>loading...</p>}>
            <VehiclesList />
          </Suspense>
        </div>
      </ErrorZone>
    </div>
  );
}

function VehiclesList() {
  const { data: vehicles } = useSuspenseQuery(
    orpc.vehicles.list.queryOptions({ staleTime: 60 * 1000 }),
  );

  return (
    <>
      {vehicles.map((vehicle) => {
        return <Vehicle key={vehicle.id} vehicle={vehicle} />;
      })}
    </>
  );
}
