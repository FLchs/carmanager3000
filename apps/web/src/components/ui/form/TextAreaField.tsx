import { useStore } from "@tanstack/react-form";

import { useFieldContext } from "../../../contexts/form-context";
import FormErrors from "./FormErrors";
import { X } from "lucide-react";

export default function TextAreaField({ label, required }: { label: string; required?: boolean }) {
  const field = useFieldContext<string>();

  const errors = useStore(field.store, (state) => state.meta.errors);

  return (
    <div>
      <label className="text-text-muted" htmlFor={field.name}>
        {label}
        {required && <span className="text-primary"> * </span>}:
      </label>
      <div className="flex flex-row">
        <div className="relative w-full rounded-lg bg-bg-light">
          <textarea
            value={field.state.value}
            className="block h-fit min-h-8 w-full resize-none py-1.5 pr-8 pl-3 text-sm outline-0 placeholder:text-sm"
            id={field.name}
            onChange={(e) => {
              field.handleChange(e.target.value);
            }}
          />
          <button type="button" className="absolute right-0 bottom-0 h-full text-text-muted">
            <X
              className="mr-2 h-4.5 w-4.5 cursor-pointer rounded-full p-0.5 hover:bg-highlight"
              onClick={() => field.setValue("")}
            />
          </button>
        </div>
      </div>
      <FormErrors errors={errors} />
    </div>
  );
}
