import { useSuspenseQuery } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Suspense } from "react";

import { ErrorZone } from "./components/ErrorZone";
import Vehicle from "./components/vehicle/Vehicle";
import VehicleCreateForm from "./components/vehicle/VehicleCreateForm";
import { orpc } from "./lib/orpc";

export default function App() {
  return (
    <div>
      <ReactQueryDevtools />
      <ErrorZone>
        <div className="w-[800px] m-auto flex flex-col gap-4">
          <h1 className="text-">Vehicles:</h1>
          <Suspense fallback={<p>loading...</p>}>
            <VehiclesList />
          </Suspense>
          <VehicleCreateForm />
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
