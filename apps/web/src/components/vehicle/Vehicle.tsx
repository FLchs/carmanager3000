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
    <div className="rounded-2xl p-4 bg-elevated border-highlight border-1">
      <div>
        <img className="h-12 absolute" src="/kia-logo.png" />
        <img className="w-full" src="/kia-magentis.jpg" />
      </div>
      <div className="flex gap-4 mt-4 justify-between">
        <div>
          <h3 className="font-bold mb-2">{model}</h3>
          <p className="text-muted">
            {brand} {model} {trim} - {year}
          </p>
          <p className="text-muted">
            {engine} - {power}
          </p>
        </div>
        <VehicleMenu id={id} />
      </div>
    </div>
  );
}

export default Vehicle;
