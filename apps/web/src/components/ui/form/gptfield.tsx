import { useStore } from "@tanstack/react-form";
import { format, isValid, parse, set } from "date-fns";
import { useState } from "react";

import { useFieldContext } from "../../../contexts/form-context";
import FormErrors from "./FormErrors";

type Parts = {
  day: string;
  month: string;
  year: string;
};

export default function DateFieldGpt({ label }: { label: string }) {
  const field = useFieldContext<Date | null>();
  const errors = useStore(field.store, (s) => s.meta.errors);

  const [parts, setParts] = useState<Parts>(() => {
    const v = field.state.value;
    return {
      day: v ? String(v.getDate()).padStart(2, "0") : "",
      month: v ? String(v.getMonth() + 1).padStart(2, "0") : "",
      year: v ? String(v.getFullYear()) : "",
    };
  });

  function update<K extends keyof Parts>(key: K, value: string) {
    const next = { ...parts, [key]: value };
    setParts(next);

    const d = Number(next.day);
    const m = Number(next.month) - 1;
    const y = Number(next.year);

    if (!d || !next.month || !next.year) {
      field.handleChange(null);
      return;
    }

    const date = set(new Date(), {
      date: d,
      month: m,
      year: y,
    });

    if (isValid(date)) {
      field.handleChange(date);
    }
  }

  return (
    <div className="grid gap-1">
      <label className="text-text-muted">{label}</label>
      {format(field.state.value ?? new Date(), "dd/MM/yyyy")}
      <div className="flex gap-2">
        <Input
          placeholder="DD"
          value={parts.day}
          onChange={(v) => update("day", v)}
          onBlur={field.handleBlur}
          maxLength={2}
        />
        <Input
          placeholder="MM"
          value={parts.month}
          onChange={(v) => update("month", v)}
          maxLength={2}
        />
        <Input
          placeholder="YYYY"
          value={parts.year}
          onChange={(v) => update("year", v)}
          maxLength={4}
        />
      </div>

      <FormErrors errors={errors} />
    </div>
  );
}

function Input({
  value,
  onChange,
  ...props
}: {
  value: string;
  onChange: (v: string) => void;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      inputMode="numeric"
      className="bg-bg-light border-border text-text-muted w-16 rounded-lg border p-2 text-center"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
