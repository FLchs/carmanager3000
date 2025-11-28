import { useStore } from "@tanstack/react-form";
import { format, parseISO } from "date-fns";

import { useFieldContext } from "../../../contexts/form-context";

export default function DateField({ label }: { label: string }) {
  const field = useFieldContext<Date>();

  const errors = useStore(field.store, (state) => state.meta.errors);

  return (
    <div className="grid">
      <label className="text-text-muted" htmlFor={field.name}>
        {label}
      </label>
      <input
        className="bg-bg-light border-border text-text-muted rounded-lg border-1 p-2 outline-0"
        id={field.name}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(parseISO(e.target.value))}
        type="date"
        value={format(field.state.value, "yyyy-MM-dd")}
      />
      {errors.map((error: string) => (
        <div key={error} style={{ color: "red" }}>
          {error}
        </div>
      ))}
    </div>
  );
}
