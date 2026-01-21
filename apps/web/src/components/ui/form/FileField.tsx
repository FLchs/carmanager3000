import { useStore } from "@tanstack/react-form";

import { useFieldContext } from "../../../contexts/form-context";
import FormErrors from "./FormErrors";

export default function FileField({ label }: { label: string }) {
  const field = useFieldContext<string>();

  const errors = useStore(field.store, (state) => state.meta.errors);

  return (
    <div className="grid">
      <label className="text-text-muted" htmlFor={field.name}>
        {label}
      </label>
      <input
        type="file"
        className="bg-bg-light border-border text-text-muted rounded-lg border p-2 outline-0"
        id={field.name}
        onBlur={field.handleBlur}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            console.log(file);
            field.handleChange(file as any);
          }
        }}
        // onChange={(e) => field.handleChange(e.target.value)}
        // value={field.state.value}
      />
      <FormErrors errors={errors} />
    </div>
  );
}
