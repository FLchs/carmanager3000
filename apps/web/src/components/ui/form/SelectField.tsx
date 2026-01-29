import { useStore } from "@tanstack/react-form";

import { useFieldContext } from "../../../contexts/form-context";
import FormErrors from "./FormErrors";

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
              className="block h-8 w-full pl-2 text-text-muted outline-0"
            >
              <option value={0}>-</option>
              {options?.map(({ id, name }) => {
                return (
                  <option value={id} key={id}>
                    {name}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <FormErrors errors={errors} />
      </div>
    </>
  );
}
