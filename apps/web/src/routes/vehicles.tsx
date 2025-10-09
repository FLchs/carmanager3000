import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense, useState } from "react";

import { ErrorZone } from "../components/ErrorZone";
import Button from "../components/ui/Button";
import Vehicle from "../components/vehicle/Vehicle";
import VehicleCreateForm from "../components/vehicle/VehicleCreateForm";
import { orpc } from "../lib/orpc";

export const Route = createFileRoute("/vehicles")({
  component: RouteComponent,
});

function RouteComponent() {
  const [showNewVehicleForm, setShowNewVehicleForm] = useState(false);
  return (
    <div className="mt-4">
      <ErrorZone>
        <div className="w-[800px] m-auto flex flex-col gap-4">
          <div className="flex flex-row justify-between">
            <h1 className="font-bold">Vehicles</h1>
            <Button
              callback={() => setShowNewVehicleForm(!showNewVehicleForm)}
              label={showNewVehicleForm ? "Cancel" : "Add"}
            />
          </div>
          {showNewVehicleForm && <VehicleCreateForm />}
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
