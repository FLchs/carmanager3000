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
      <label className="text-text-muted" htmlFor={field.name}>
        {label}:
      </label>
      <div className="flex flex-row bg-bg-light rounded-lg w-fit h-8 mt-1">
        <div className="relative px-1 w-fit my-auto">
          <input
            type="text"
            value={fieldString}
            onChange={(e) => setFieldString(e.target.value)}
            onBlur={(e) => onBlur(e.target.value)}
            className="outline-0 w-32"
            placeholder={localeFormat.toLowerCase()}
            maxLength={localeFormat.length}
          />

          <button className="absolute right-1.5 h-full" type="button" onClick={clearField}>
            <X className="w-4.5 cursor-pointer rounded-full h-4.5 p-0.5 text-text-muted" />
          </button>
        </div>
        <button
          type="button"
          className="border-l-2 border-bg-dark p-1 cursor-pointer"
          onClick={() => setShowCalendar(true)}
        >
          <CalendarIcon className="w-6 m-auto px-1" />
        </button>
      </div>
      {showCalendar && <Calendar value={field.state.value ?? new Date()} onChange={setDate} />}
      <FormErrors errors={errors} />
    </div>
  );
}

export default DateInput;
