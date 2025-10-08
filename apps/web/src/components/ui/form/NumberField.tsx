import { useStore } from "@tanstack/react-form";

import { useFieldContext } from "../../../contexts/form-context";

export default function NumberField({ label }: { label: string }) {
  const field = useFieldContext<string>();

  const errors = useStore(field.store, (state) => state.meta.errors);

  return (
    <div className="grid">
      <label htmlFor={field.name}>{label}</label>
      <input
        className="bg-highlight rounded-lg p-2 border-surface border-1 outline-0"
        id={field.name}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        type="number"
        value={field.state.value}
      />
      {errors.map((error: string) => (
        <div key={error} style={{ color: "red" }}>
          {error}
        </div>
      ))}
    </div>
  );
}
