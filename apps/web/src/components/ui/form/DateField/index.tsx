import { useStore } from "@tanstack/react-form";
import { format, isValid, parse } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { useCallback, useState } from "react";

import { useFieldContext } from "@/contexts/form-context";
import { useLocaleDateFormat } from "@/hooks/useLocaleDateFormat";

import FormErrors from "../FormErrors";
import { Calendar } from "./Calendar";

function DateInput({ label }: { label: string }) {
  const field = useFieldContext<Date | null>();
  const errors = useStore(field.store, (state) => state.meta.errors);
  const [fieldString, setFieldString] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);

  const localeFormat = useLocaleDateFormat();

  const onBlur = useCallback(
    (value: string) => {
      const date = parse(value, localeFormat, new Date());
      if (isValid(date)) {
        setFieldString(format(date, localeFormat));
        field.handleChange(date);
      } else {
        setFieldString("");
      }
    },
    [localeFormat, field],
  );

  const setDate = useCallback(
    (date: Date) => {
      setFieldString(format(date, localeFormat));
      field.handleChange(date);
      setShowCalendar(false);
    },
    [field, localeFormat],
  );

  const clearField = useCallback(() => {
    setFieldString("");
    field.handleChange(null);
  }, [field]);

  return (
    <div>
      <label htmlFor={field.name} className="text-text-muted">
        {label}:
      </label>
      <div className="flex flex-row">
        <div className="relative w-full rounded-l-lg bg-bg-light">
          <input
            value={fieldString}
            onChange={(e) => setFieldString(e.target.value)}
            onBlur={(e) => onBlur(e.target.value)}
            type="text"
            id={field.name}
            className="block h-8 w-full p-3 text-sm outline-0 placeholder:text-sm"
            placeholder={localeFormat.toLowerCase()}
            maxLength={localeFormat.length}
          />
          <button type="button" className="absolute right-0 bottom-0 h-full text-text-muted">
            <X
              className="mr-2 h-4.5 w-4.5 cursor-pointer rounded-full p-0.5 hover:bg-highlight"
              onClick={clearField}
            />
          </button>
        </div>
        <button
          type="button"
          className="h-8 cursor-pointer rounded-r-lg border-l-2 border-bg-dark bg-bg-light px-1.5 text-text-muted hover:bg-highlight"
          onClick={() => setShowCalendar(true)}
        >
          <CalendarIcon className="h-4 w-4" />
        </button>
      </div>
      {showCalendar && <Calendar value={field.state.value ?? new Date()} onChange={setDate} />}
      <FormErrors errors={errors} />
    </div>
  );
}

export default DateInput;
