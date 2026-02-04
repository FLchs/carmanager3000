import { useStore } from "@tanstack/react-form";

import { useFieldContext } from "../../../contexts/form-context";
import FormErrors from "./FormErrors";
import { ChevronsUpDown } from "lucide-react";

export default function SelectField({
  label,
  options,
}: {
  label: string;
  options?: { id: string | number; name: string }[];
}) {
  const field = useFieldContext<string>();

  const errors = useStore(field.store, (state) => state.meta.errors);

  return (
    <>
      <div>
        <label className="text-text-muted" htmlFor={field.name}>
          {label}:
        </label>
        <div className="flex flex-row">
          <div className="relative w-full rounded-lg bg-bg-light">
            <select
              id={field.name}
              onBlur={field.handleBlur}
              onChange={(e) => {
                field.handleChange(e.target.value);
              }}
              value={field.state.value}
              className="block h-8 w-full appearance-none pl-2 text-text-muted outline-0"
            >
              <option value={0}></option>
              {options?.map(({ id, name }) => {
                return (
                  <option value={id} key={id}>
                    {name}
                  </option>
                );
              })}
            </select>
            <button
              type="button"
              className="pointer-events-none absolute right-0 bottom-0 h-full text-text-muted"
            >
              <ChevronsUpDown className="pointer-events-none mr-2 h-4.5 w-4.5 p-0.5" />
            </button>
          </div>
        </div>
        <FormErrors errors={errors} />
      </div>
    </>
  );
}
