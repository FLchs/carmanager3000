import { useStore } from "@tanstack/react-form";

import { useFieldContext } from "../../../contexts/form-context";

export default function TextField({ label }: { label: string }) {
  const field = useFieldContext<string>();

  const errors = useStore(field.store, (state) => state.meta.errors);

  return (
    <div className="grid">
      <label className="text-text-muted" htmlFor={field.name}>
        {label}
      </label>
      <input
        className="bg-bg-light rounded-lg p-2 border-border border-1 outline-0 text-text-muted"
        id={field.name}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
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
