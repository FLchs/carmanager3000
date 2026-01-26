import { useStore } from "@tanstack/react-form";
import { MinusIcon, PlusIcon, X } from "lucide-react";
import { useCallback } from "react";

import { useFieldContext } from "../../../contexts/form-context";
import FormErrors from "./FormErrors";

export default function NumberField({
  label,
  nullable = false,
}: {
  label: string;
  nullable?: boolean;
}) {
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
      <div className="flex flex-row bg-bg-light rounded-lg w-fit mt-1">
        <button
          type="button"
          className="border-r-2 border-bg-dark p-1 cursor-pointer"
          onClick={() => updateValue(-1)}
        >
          <MinusIcon className="w-6 m-auto px-1" />
        </button>
        <div className="relative px-1">
          <input
            size={6}
            className="text-text-muted h-full pr-6 pl-2 outline-0"
            id={field.name}
            name={field.name}
            value={field.state.value}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              field.handleChange(Number.isNaN(val) ? 0 : val);
            }}
          />
          <button className="absolute right-1.5 h-full" type="button">
            <X
              className="w-4.5 cursor-pointer rounded-full h-4.5 p-0.5 text-text-muted"
              onClick={() => field.clearValues()}
            />
          </button>
        </div>
        {nullable && (
          <button
            type="button"
            className="border-l-2 border-bg-dark p-1 cursor-pointer"
            onClick={() => updateValue(1)}
          >
            <PlusIcon className="w-6 m-auto px-1" />
          </button>
        )}
        <FormErrors errors={errors} />
      </div>
    </div>
  );
}
