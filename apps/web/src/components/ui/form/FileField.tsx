import { useStore } from "@tanstack/react-form";

import { useFieldContext } from "../../../contexts/form-context";
import FormErrors from "./FormErrors";
import { FileIcon, X } from "lucide-react";
import { useMemo } from "react";

export default function FileField({
  label,
  required = false,
}: {
  label: string;
  required?: boolean;
}) {
  const field = useFieldContext<File | undefined>();

  const errors = useStore(field.store, (state) => state.meta.errors);

  const previewUrl = useMemo(() => {
    if (field.state.value == null) return "";
    return URL.createObjectURL(field.state.value);
  }, [field]);

  return (
    <div>
      <label className="text-text-muted" htmlFor={field.name}>
        {label}
        {required && <span className="text-primary"> * </span>}:
      </label>
      {previewUrl ? (
        <Preview
          onDelete={() => field.setValue(undefined)}
          name={field.state.value?.name}
          url={previewUrl}
        />
      ) : (
        <label className="relative flex h-8 cursor-pointer flex-row items-center gap-2 rounded-lg bg-bg-light px-1.5 text-text-muted hover:bg-highlight">
          <FileIcon className="h-4 w-4" />
          <span>Browse...</span>
          <input
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                // TODO: remove it when Tanstack Form is fixed
                // https://github.com/TanStack/form/issues/1932
                Object.defineProperties(file, {
                  name: {
                    value: file.name,
                    enumerable: true,
                  },
                  size: {
                    value: file.size,
                    enumerable: true,
                  },
                  type: {
                    value: file.type,
                    enumerable: true,
                  },
                });

                field.handleChange(file as any);
              }
            }}
            required={required}
            type="file"
            id={field.name}
            className="hidden"
          />
        </label>
      )}
      <FormErrors errors={errors} />
    </div>
  );
}

function Preview({ url, onDelete, name }: { url: string; onDelete: () => void; name?: string }) {
  return (
    <div className="relative my-2 w-full rounded-lg bg-bg-light p-4 text-text-muted">
      <object data={url} className="m-auto aspect-auto max-h-72 max-w-full"></object>
      <p className="mx-auto text-center">{name}</p>
      <button type="button" className="absolute top-2 right-2 text-text-muted">
        <X
          className="h-4.5 w-4.5 cursor-pointer rounded-full bg-highlight p-0.5 hover:bg-highlight"
          onClick={onDelete}
        />
      </button>
    </div>
  );
}
