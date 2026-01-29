import { useStore } from "@tanstack/react-form";
import { MinusIcon, PlusIcon, X } from "lucide-react";
import { useCallback } from "react";

import { useFieldContext } from "../../../contexts/form-context";
import FormErrors from "./FormErrors";

export default function NumberField({ label }: { label: string }) {
  const field = useFieldContext<number | "">();

  const updateValue = useCallback(
    (int: number) => {
      field.handleChange(Math.max(Number(field.state.value) + int, 0));
    },
    [field],
  );

  const errors = useStore(field.store, (state) => state.meta.errors);

  return (
    <div>
      <label className="text-text-muted" htmlFor={field.name}>
        {label}:
      </label>
      <div className="flex flex-row">
        <button
          type="button"
          className="h-8 cursor-pointer rounded-l-lg border-r-2 border-bg-dark bg-bg-light px-1.5 text-text-muted hover:bg-highlight"
          onClick={() => updateValue(-1)}
        >
          <MinusIcon className="h-4 w-4" />
        </button>
        <div className="relative w-full bg-bg-light">
          <input
            value={field.state.value}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              field.handleChange(Number.isNaN(val) ? 0 : val);
            }}
            type="text"
            id={field.name}
            className="block h-8 w-full p-3 text-sm outline-0 placeholder:text-sm"
          />
          <button type="button" className="absolute right-0 bottom-0 h-full text-text-muted">
            <X
              className="mr-2 h-4.5 w-4.5 cursor-pointer rounded-full p-0.5 hover:bg-highlight"
              onClick={() => field.clearValues()}
            />
          </button>
        </div>
        <button
          type="button"
          className="h-8 cursor-pointer rounded-r-lg border-l-2 border-bg-dark bg-bg-light px-1.5 text-text-muted hover:bg-highlight"
          onClick={() => updateValue(1)}
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>
      <FormErrors errors={errors} />
    </div>
  );
}
