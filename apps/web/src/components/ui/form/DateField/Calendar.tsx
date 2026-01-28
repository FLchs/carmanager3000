import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  getDate,
  getMonth,
  getUnixTime,
  getYear,
  isSameDay,
  isSameMonth,
  setMonth,
  setYear,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { months, weekdays, years } from "./constants";

export function Calendar({ value, onChange }: { value: Date; onChange: (date: Date) => void }) {
  const [shownDay, setShownDay] = useState(value);

  const changeMonth = useCallback((amount: number) => {
    setShownDay((day) => addMonths(day, amount));
  }, []);

  const selectMonth = useCallback((month: number) => {
    setShownDay((day) => setMonth(day, month));
  }, []);
  const selectYear = useCallback((year: number) => {
    setShownDay((day) => setYear(day, year));
  }, []);

  const days = useMemo(
    () =>
      eachDayOfInterval({
        start: startOfWeek(startOfMonth(shownDay), { weekStartsOn: 1 }),
        end: endOfWeek(endOfMonth(shownDay), { weekStartsOn: 1 }),
      }),
    [shownDay],
  );

  return (
    <>
      <div className="fixed inset-0 z-30" onPointerDown={() => onChange(value)} />
      <div className="bg-bg-light border-bg-dark rounded-lg border p-2 absolute top-0 z-40">
        <div className="flex flex-row justify-between mb-2">
          <ArrowLeft className="cursor-pointer" onClick={() => changeMonth(-1)} />
          <select onChange={(e) => selectMonth(Number(e.target.value))} value={getMonth(shownDay)}>
            {months.map((m, i) => (
              <option key={m} value={i}>
                {m}
              </option>
            ))}
          </select>
          <select onChange={(e) => selectYear(Number(e.target.value))} value={getYear(shownDay)}>
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
              onClick={() => isSameMonth(d, shownDay) && onChange(d)}
              className={`m-1 rounded-lg text-center ${isSameDay(d, value) ? "bg-primary-dark hover:bg-primary" : ""} ${isSameMonth(d, shownDay) ? "hover:bg-bg cursor-pointer" : "text-text-muted cursor-default"}`}
            >
              {getDate(d)}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
