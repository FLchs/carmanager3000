import { useSuspenseQuery } from "@tanstack/react-query";

import "./App.css";
import { Suspense } from "react";

import { ErrorZone } from "./components/ErrorZone";
import { orpc } from "./lib/orpc";

export default function App() {
  return (
    <div className="card">
      <p>Vehicles:</p>
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
    <li>
      {vehicles?.map((vehicle) => {
        return (
          <ul key={vehicle.id}>
            {vehicle.id} - {vehicle.name}
          </ul>
        );
      })}
    </li>
  );
}
