import { useStore } from "@tanstack/react-form";
import { format } from "date-fns";
import { CalendarIcon, PlusIcon, X } from "lucide-react";
import { useCallback, useState } from "react";
import { z } from "zod/v4";

import { useFieldContext } from "@/contexts/form-context";

import FormErrors from "./FormErrors";

function DateInput({ label }: { label: string }) {
  const field = useFieldContext<string | null>();
  const errors = useStore(field.store, (state) => state.meta.errors);
  const [stringDay, setStringDay] = useState<{ day: string; month: string; year: string }>({
    day: "",
    month: "",
    year: "",
  });

  const onChange = useCallback((unit: "day" | "month" | "year", value: string) => {
    const schema = unit === "year" ? z.string().regex(/^\d{1,4}$/) : z.string().regex(/^\d{1,2}$/);
    try {
      const parsed = schema.parse(value);
      setStringDay((val) => {
        // for (const key in val) {
        //   const k = key as keyof typeof val;
        //   if (val[k] === "") {
        //     val[k] = k === "year" ? "2012" : "01";
        //   }
        // }
        return { ...val, [unit]: parsed };
      });
    } catch {
      setStringDay((val) => ({ ...val, [unit]: "" }));
    }
  }, []);

  const sanitize = useCallback(() => {
    setStringDay((value) => ({
      day: value.day !== "" ? value.day.padStart(2, "0") : "",
      month: value.month !== "" ? value.month.padStart(2, "0") : "",
      year: value.year,
    }));

    // if (stringDay.day !== "" && stringDay.month !== "" && stringDay.year !== "") {
    field.handleChange(
      `${stringDay.year}-${stringDay.month.padStart(2, "0")}-${stringDay.day.padStart(2, "0")}`,
    );
    // }
  }, [stringDay, field]);

  const clearField = useCallback(() => {
    setStringDay({ day: "", month: "", year: "" });
    field.handleChange(null);
  }, [field]);

  return (
    <div>
      <label className="text-text-muted" htmlFor={field.name}>
        {label}:
      </label>
      <div className="flex flex-row bg-bg-light rounded-lg w-fit h-8 mt-1">
        <div className="relative px-1 w-fit my-auto">
          <input type="date" className="" />
          <input
            type="text"
            value={stringDay.day}
            onBlur={() => sanitize()}
            onChange={(e) => onChange("day", e.target.value)}
            inputMode="numeric"
            className="outline-0 w-8"
            placeholder="DD"
            pattern="[0-9]*"
            maxLength={2}
          />
          <input
            type="text"
            value={stringDay.month}
            onBlur={() => sanitize()}
            onChange={(e) => onChange("month", e.target.value)}
            inputMode="numeric"
            className="outline-0 w-8"
            placeholder="MM"
            pattern="[0-9]*"
            maxLength={2}
          />

          <input
            type="text"
            value={stringDay.year}
            onBlur={() => sanitize()}
            onChange={(e) => onChange("year", e.target.value)}
            inputMode="numeric"
            className="outline-0 w-16"
            placeholder="YYYY"
            pattern="[0-9]*"
            maxLength={4}
          />

          <button className="absolute right-1.5 h-full" type="button">
            <X
              className="w-4.5 cursor-pointer rounded-full h-4.5 p-0.5 text-text-muted"
              onClick={clearField}
            />
          </button>
        </div>
        <button
          type="button"
          className="border-l-2 border-bg-dark p-1 cursor-pointer"
          onClick={console.log}
        >
          <CalendarIcon className="w-6 m-auto px-1" />
        </button>
      </div>
      <FormErrors errors={errors} />
    </div>
  );
}

export default DateInput;
