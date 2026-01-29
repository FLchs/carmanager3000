import { useStore } from "@tanstack/react-form";

import { useFieldContext } from "../../../contexts/form-context";
import FormErrors from "./FormErrors";
import { FileIcon, X } from "lucide-react";

export default function FileField({ label }: { label: string }) {
  const field = useFieldContext<File | null>();

  const errors = useStore(field.store, (state) => state.meta.errors);

  return (
    <div>
      <label className="text-text-muted" htmlFor={field.name}>
        {label}:
      </label>
      <div className="relative flex flex-row rounded-lg bg-bg-light">
        <label className="relative flex h-8 cursor-pointer flex-row items-center gap-2 rounded-l-lg border-r-2 border-bg-dark bg-bg-light px-1.5 text-text-muted hover:bg-highlight">
          <FileIcon className="h-4 w-4" />
          <span>Browse...</span>
          <input
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                console.log(file);
                field.handleChange(file as any);
              }
            }}
            type="file"
            id={field.name}
            className="hidden"
          />
        </label>
        <button type="button" className="absolute right-0 bottom-0 h-full text-text-muted">
          <X
            className="mr-2 h-4.5 w-4.5 cursor-pointer rounded-full p-0.5 hover:bg-highlight"
            onClick={() => field.setValue(null)}
          />
        </button>
        <span className="m-auto text-text-muted">{field.state.value?.name}</span>
      </div>
      <FormErrors errors={errors} />
    </div>
  );
}
