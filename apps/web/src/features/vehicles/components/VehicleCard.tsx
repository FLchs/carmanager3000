import type { z } from "zod/v4";

import { getVehicleSchema } from "@cm3k/validation";
import { Link } from "@tanstack/react-router";

import Card from "@/components/ui/Card";
import VehicleMenu from "@/features/vehicles/components/vehicle-menu/VehicleMenu";

type Vehicle = z.infer<typeof getVehicleSchema>;

function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const { id, brand, engine, model, power, trim, year } = vehicle;

  return (
    <Card>
      <div>
        <img className="absolute h-12" src="/kia-logo.png" />
        <Link params={{ vehicleId: id.toString() }} to="/vehicles/$vehicleId">
          <img className="w-full" src="/kia-magentis.jpg" />
        </Link>
      </div>
      <div className="mt-4 flex justify-between gap-4">
        <div>
          <h3 className="text-text mb-2 font-bold">{model}</h3>
          <p className="text-text-muted">
            {brand} {model} {trim} - {year}
          </p>
          <p className="text-text-muted">
            {engine} - {power}
          </p>
        </div>
        <VehicleMenu id={id} />
      </div>
    </Card>
  );
}

export default VehicleCard;
