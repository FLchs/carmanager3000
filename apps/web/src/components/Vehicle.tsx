interface Props {
  brand: string;
  engine: string;
  model: string;
  power: number;
  trim: string;
  year: number;
}

function Vehicle({ brand, engine, model, power, trim, year }: Props) {
  return (
    <div className="rounded-2xl p-4 bg-elevated border-highlight border-1">
      <div>
        <img className="h-12 absolute" src="/kia-logo.png" />
        <img className="w-full" src="/kia-magentis.jpg" />
      </div>
      <div className="flex gap-4 mt-4 justify-between">
        <div>
          <h3 className="font-bold mb-2 text-base">{model}</h3>
          <p className="text-muted">
            {brand} {model} {trim} - {year}
          </p>
          <p className="text-muted">
            {engine} - {power}
          </p>
        </div>
        <span className="text-muted hover:text-white hover:cursor-pointer h-6">
          ⠇
        </span>
      </div>
    </div>
  );
}

export default Vehicle;
