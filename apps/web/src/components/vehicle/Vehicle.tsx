import { Link } from "@tanstack/react-router";

import Card from "../ui/Card";
import VehicleMenu from "./VehicleMenu";

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
        <img className="h-12 absolute" src="/kia-logo.png" />
        <Link params={{ vehicleId: id.toString() }} to="/vehicles/$vehicleId">
          <img className="w-full" src="/kia-magentis.jpg" />
        </Link>
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
        <VehicleMenu id={id} />
      </div>
    </Card>
  );
}

export default Vehicle;
