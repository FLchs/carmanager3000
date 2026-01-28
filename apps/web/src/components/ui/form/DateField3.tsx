import { useStore } from "@tanstack/react-form";
import {
  addDays,
  addMonths,
  differenceInDays,
  endOfMonth,
  format,
  getDate,
  getMonth,
  getUnixTime,
  getYear,
  isSameDay,
  isSameMonth,
  isValid,
  nextSunday,
  parse,
  previousMonday,
  set,
  setDate,
  setMonth,
  setYear,
  startOfMonth,
} from "date-fns";
import { ArrowLeft, ArrowRight, CalendarIcon, X } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { useFieldContext } from "../../../contexts/form-context";
import DateInput from "./DateInput";
import FormErrors from "./FormErrors";
//
// export default function DateField3({ label }: { label: string }) {
//   const field = useFieldContext<Date>();
//
//   const errors = useStore(field.store, (state) => state.meta.errors);
//
//   return (
//     <div className="grid">
//       <label className="text-text-muted" htmlFor={field.name}>
//         {label}
//       </label>
//       <input
//         className="bg-bg-light border-border text-text-muted rounded-lg border p-2 outline-0"
//         id={field.name}
//         onBlur={field.handleBlur}
//         onChange={(e) => field.handleChange(e.target.value)}
//         value={field.state.value}
//       />
//       <FormErrors errors={errors} />
//     </div>
//   );
// }
//

export function CalendarField({ label, nullable = true }: { label: string; nullable?: boolean }) {
  const [shownDay, setShownDay] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date());
  const field = useFieldContext<Date | null>();

  const [showCalendar, setShowCalendar] = useState(false);

  const errors = useStore(field.store, (state) => state.meta.errors);

  const changeMonth = useCallback((amount: number) => {
    setShownDay((day) => addMonths(day, amount));
  }, []);

  const selectMonth = useCallback((month: number) => {
    setShownDay((day) => setMonth(day, month));
  }, []);
  const selectYear = useCallback((year: number) => {
    setShownDay((day) => setYear(day, year));
  }, []);

  const onApply = useCallback(() => {
    setShowCalendar(false);
    field.handleChange(selectedDay);
  }, [field, selectedDay]);

  const days = useMemo(() => {
    const startDay = previousMonday(addDays(startOfMonth(shownDay), 1));
    const result = [];
    const interval = differenceInDays(nextSunday(addDays(endOfMonth(shownDay), -1)), startDay);
    // eachDayOfInterval
    for (let index = 0; index < interval + 1; index++) {
      result.push(addDays(startDay, index));
    }
    return result;
  }, [shownDay]);

  const selectDay = useCallback(
    (day: Date) => {
      if (isSameMonth(day, shownDay)) {
        setSelectedDay(day);
        setParts({ day: format(day, "dd"), month: format(day, "MM"), year: format(day, "yyyy") });
      }
    },
    // oxlint-disable-next-line exhaustive-deps
    [shownDay, field],
  );

  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = useMemo(() => {
    const currentYear = getYear(new Date());
    let years = [];
    for (let index = 0; index < 100; index++) {
      years.push(currentYear - index);
    }
    return years;
  }, []);

  type Parts = {
    day: string;
    month: string;
    year: string;
  };
  const [parts, setParts] = useState<Parts>(() => {
    const v = field.state.value ?? new Date();
    return {
      day: v ? String(v.getDate()).padStart(2, "0") : "",
      month: v ? String(v.getMonth() + 1).padStart(2, "0") : "",
      year: v ? String(v.getFullYear()) : "",
    };
  });

  function update<K extends keyof Parts>(key: K, value: string) {
    const next = { ...parts, [key]: value };
    setParts(next);

    const d = Number(next.day.slice(0, 2));
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
    <div>
      <div>
        <DateInput />
      </div>
      <label className="text-text-muted" htmlFor={field.name}>
        {label}:
      </label>
      <div className="flex flex-row bg-bg-light rounded-lg w-fit mt-1">
        <div className="relative px-1 h-8.5">
          {/* <div className="bg-bg-light w-32 border-border text-text-muted rounded-lg border p-1 inline-block"> */}
          {/*   {field.state.value && format(field.state.value, "dd/MM/yyyy")} */}
          {/* </div> */}
          <div className="flex flex-row justify-start">
            <span
              className="text-text-muted h-full my-auto outline-0 w-6 ml-1"
              contentEditable
              suppressContentEditableWarning
              onChange={(e) => {
                update("day", e.currentTarget.innerText);
              }}
            >
              {parts.day}
            </span>
            <span className="text-text-muted h-full py-1">/</span>
            <input
              className="text-text-muted h-full my-auto outline-0 w-6 ml-1"
              value={parts.month}
              onChange={(e) => {
                update("month", e.target.value);
              }}
            />
            <span className="text-text-muted h-full py-1">/</span>
            <input
              className="text-text-muted h-full my-auto outline-0 w-12 ml-1 mr-5"
              value={parts.year}
              onChange={(e) => {
                update("year", e.target.value);
              }}
            />
          </div>
          {nullable && (
            <button className="absolute right-1.5 h-full top-0" type="button">
              <X
                className="w-4.5 cursor-pointer rounded-full h-4.5 p-0.5 text-text-muted"
                onClick={() => field.handleChange(null)}
              />
            </button>
          )}
        </div>
        <button
          type="button"
          className="border-l-2 border-bg-dark p-1 cursor-pointer"
          onClick={() => {
            setShownDay(field.state.value ?? new Date());
            setSelectedDay(field.state.value ?? new Date());
            console.log(field.state.value);
            console.log(selectedDay);
            setShowCalendar(true);
          }}
        >
          <CalendarIcon className="w-6 m-auto px-1" />
        </button>

        {showCalendar && (
          <div className="bg-bg-light border-bg-dark rounded-lg border p-2 absolute top-0 z-10">
            <div className="flex flex-row justify-between mb-2">
              <ArrowLeft className="cursor-pointer" onClick={() => changeMonth(-1)} />
              <select
                onChange={(e) => selectMonth(Number(e.target.value))}
                value={getMonth(shownDay)}
              >
                {months.map((m, i) => (
                  <option key={m} value={i}>
                    {m}
                  </option>
                ))}
              </select>
              <select
                onChange={(e) => selectYear(Number(e.target.value))}
                value={getYear(shownDay)}
              >
                {years.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <ArrowRight className="cursor-pointer" onClick={() => changeMonth(1)} />
            </div>
            <div className="grid grid-cols-7 text-center">
              {weekdays.map((d) => (
                <span key={d}>{d}</span>
              ))}
              {days.map((d) => (
                <span
                  key={getUnixTime(d)}
                  onClick={() => selectDay(d)}
                  className={`m-1 rounded-lg text-center ${isSameDay(d, selectedDay) ? "bg-primary-dark hover:bg-primary" : ""} ${isSameMonth(d, shownDay) ? "hover:bg-bg cursor-pointer" : "text-text-muted cursor-default"}`}
                >
                  {getDate(d)}
                </span>
              ))}
            </div>
            <FormErrors errors={errors} />
            <div className="flex flex-row justify-end gap-2 m-2">
              <button
                onClick={() => setShowCalendar(false)}
                className="border-bg border rounded-sm px-2 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={onApply}
                className="border-bg border rounded-sm px-2 bg-primary-dark cursor-pointer"
              >
                Apply
              </button>
            </div>
          </div>
        )}

        <FormErrors errors={errors} />
      </div>
    </div>
  );
}
