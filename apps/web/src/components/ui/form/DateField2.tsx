import { useStore } from "@tanstack/react-form";
import { format, parseISO } from "date-fns";
import { X } from "lucide-react";

import { useFieldContext } from "../../../contexts/form-context";
import FormErrors from "./FormErrors";

export default function DateField({ label }: { label: string }) {
  const field = useFieldContext<Date | string>();

  const errors = useStore(field.store, (state) => state.meta.errors);

  return (
    <div className="grid">
      <label className="text-text-muted" htmlFor={field.name}>
        {label}
      </label>
      {typeof field.state.value}
      <div className="flex flex-row">
        <div className="flex flex-row relative w-full">
          <input
            className="bg-bg-light border-border text-text-muted rounded-lg border p-2 outline-0"
            id={field.name}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(parseISO(e.target.value))}
            type="date"
            value={field.state.value === "" ? "" : format(field.state.value, "yyyy-MM-dd")}
          />
          <div className="absolute right-0 flex flex-row h-full">
            <div className="flex flex-col m-auto">
              <X
                className="h-6 w-6 py-1 mr-1.5 cursor-pointer"
                onClick={() => field.setValue("")}
              />
            </div>
          </div>
        </div>
      </div>

      <FormErrors errors={errors} />
    </div>
  );
}
