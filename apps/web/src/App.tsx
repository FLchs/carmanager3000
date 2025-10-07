import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";

import { ErrorZone } from "./components/ErrorZone";
import Vehicle from "./components/Vehicle";
import { orpc } from "./lib/orpc";

export default function App() {
  return (
    <div>
      <h1 className="text-">Vehicles:</h1>
      <ErrorZone>
        <Suspense fallback={<p>loading...</p>}>
          <VehiclesList />
        </Suspense>
      </ErrorZone>
    </div>
  );
}

function VehiclesList() {
  const { data: vehicles } = useSuspenseQuery(
    orpc.vehicles.list.queryOptions({ staleTime: 60 * 1000 }),
  );

  return (
    <div className="w-[800px] m-auto">
      {vehicles.map((vehicle) => {
        return (
          <Vehicle
            brand="Kia"
            engine="2.0 CVVT"
            key={vehicle.id}
            model="Magentis"
            power={144}
            trim="MG"
            year={2008}
          />
        );
      })}
    </div>
  );
}
