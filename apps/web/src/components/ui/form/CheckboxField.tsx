import { useStore } from "@tanstack/react-form";

import { useFieldContext } from "../../../contexts/form-context";
import FormErrors from "./FormErrors";

export default function CheckboxField({ label }: { label: string }) {
  const field = useFieldContext<{ id: string; value: boolean }[]>();

  const errors = useStore(field.store, (state) => state.meta.errors);

  return (
    <div className="grid">
      <label className="text-text-muted" htmlFor={field.name}>
        {label}
      </label>
      {JSON.stringify(field.state.value)}
      {field.state.value?.map(({ id, value }) => {
        return (
          <input
            key={id}
            type="checkbox"
            id={`${id}`}
            defaultChecked={value}
            onChange={() =>
              field.handleChange(
                field.state.value.map((val) =>
                  val.id === id ? { ...val, value: !val.value } : val,
                ),
              )
            }
          />
        );
      })}
      <FormErrors errors={errors} />
    </div>
  );
}

// <select
//        id={field.name}
//        onBlur={field.handleBlur}
//        onChange={(e) => {
//          console.log(e.target.value);
//          field.handleChange(e.target.value);
//        }}
//        value={field.state.value}
//        className="bg-bg-light border-border text-text-muted rounded-lg border p-2 outline-0"
//      >
//
