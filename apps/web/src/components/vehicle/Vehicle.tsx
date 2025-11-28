import { Link } from "@tanstack/react-router";

import Card from "../ui/Card";
import VehicleMenu from "./vehicleMenu";

interface VehicleData {
  brand: null | string;
  engine: null | string;
  id: number;
  model: string;
  power: null | number;
  trim: null | string;
  year: null | number;
}

function Vehicle({ vehicle }: { vehicle: VehicleData }) {
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

export default Vehicle;
