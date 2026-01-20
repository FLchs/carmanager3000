import { useStore } from "@tanstack/react-form";

import { useFieldContext } from "../../../contexts/form-context";
import FormErrors from "./FormErrors";

export default function NumberField({ label }: { label: string }) {
  const field = useFieldContext<number>();

  const errors = useStore(field.store, (state) => state.meta.errors);

  return (
    <div className="grid">
      <label className="text-text-muted" htmlFor={field.name}>
        {label}
      </label>
      <input
        className="bg-bg-light border-border text-text-muted rounded-lg border p-2 outline-0"
        id={field.name}
        name={field.name}
        value={field.state.value}
        type="number"
        inputMode="numeric"
        onChange={(e) => {
          const val = e.target.valueAsNumber;
          field.handleChange(Number.isNaN(val) ? 0 : val);
        }}
      />
      <FormErrors errors={errors} />
    </div>
  );
}
