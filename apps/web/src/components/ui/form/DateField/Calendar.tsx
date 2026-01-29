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

function getDayClassName(isSelected: boolean, isInCurrentMonth: boolean): string {
  const baseClasses = "m-1 rounded-lg text-center";
  const selectedClasses = isSelected ? "bg-primary-dark hover:bg-primary" : "";
  const monthClasses = isInCurrentMonth
    ? "cursor-pointer hover:bg-bg"
    : "cursor-default text-text-muted";

  return `${baseClasses} ${selectedClasses} ${monthClasses}`;
}

export function Calendar({ value, onChange }: { value: Date; onChange: (date: Date) => void }) {
  const [displayedDate, setDisplayedDate] = useState(value);

  const changeMonth = useCallback((amount: number) => {
    setDisplayedDate((current) => addMonths(current, amount));
  }, []);

  const selectMonth = useCallback((month: number) => {
    setDisplayedDate((current) => setMonth(current, month));
  }, []);
  const selectYear = useCallback((year: number) => {
    setDisplayedDate((current) => setYear(current, year));
  }, []);

  const handleBackdropClick = useCallback(() => {
    onChange(value);
  }, [onChange, value]);

  const days = useMemo(
    () =>
      eachDayOfInterval({
        start: startOfWeek(startOfMonth(displayedDate), { weekStartsOn: 1 }),
        end: endOfWeek(endOfMonth(displayedDate), { weekStartsOn: 1 }),
      }),
    [displayedDate],
  );

  const currentMonth = useMemo(() => getMonth(displayedDate), [displayedDate]);
  const currentYear = useMemo(() => getYear(displayedDate), [displayedDate]);

  return (
    <div className="relative">
      <div className="fixed inset-0 z-30" onPointerDown={handleBackdropClick} />
      <div className="absolute -top-8 z-40 w-64 rounded-lg border border-bg-dark bg-bg-light p-2">
        <div className="mb-2 flex flex-row justify-between gap-1">
          <ArrowLeft className="my-auto h-4 w-4 cursor-pointer" onClick={() => changeMonth(-1)} />
          <select
            className="cursor-pointer"
            onChange={(e) => selectMonth(Number(e.target.value))}
            value={currentMonth}
          >
            {months.map((monthName, index) => (
              <option key={monthName} value={index}>
                {monthName}
              </option>
            ))}
          </select>
          <select
            className="cursor-pointer"
            onChange={(e) => selectYear(Number(e.target.value))}
            value={currentYear}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <ArrowRight className="my-auto h-4 w-4 cursor-pointer" onClick={() => changeMonth(1)} />
        </div>
        <div className="grid grid-cols-7 text-center">
          {weekdays.map((weekday) => (
            <span className="mx-2 text-sm text-text-muted" key={weekday}>
              {weekday}
            </span>
          ))}
          {days.map((date) => {
            const isInCurrentMonth = isSameMonth(date, displayedDate);
            const isSelected = isSameDay(date, value);

            return (
              <span
                key={getUnixTime(date)}
                onClick={() => isInCurrentMonth && onChange(date)}
                className={getDayClassName(isSelected, isInCurrentMonth)}
              >
                {getDate(date)}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
