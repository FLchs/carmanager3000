import {
  addDays,
  addMonths,
  differenceInDays,
  endOfMonth,
  getDate,
  getMonth,
  getUnixTime,
  getYear,
  isSameDay,
  isSameMonth,
  nextSunday,
  previousMonday,
  setMonth,
  setYear,
  startOfMonth,
} from "date-fns";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

export function Calendar() {
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [shownDay, setShownDay] = useState(new Date());

  const changeMonth = useCallback((amount: number) => {
    setShownDay((day) => addMonths(day, amount));
  }, []);

  const selectMonth = useCallback((month: number) => {
    setShownDay((day) => setMonth(day, month));
  }, []);
  const selectYear = useCallback((year: number) => {
    setShownDay((day) => setYear(day, year));
  }, []);
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
      setSelectedDay((selected) => {
        if (isSameMonth(day, shownDay)) {
          return day;
        }
        return selected;
      });
    },
    [shownDay],
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

  return (
    <div className="bg-bg-light border-bg-dark rounded-lg border p-2">
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
            onClick={() => selectDay(d)}
            className={`m-1 rounded-lg text-center ${isSameDay(d, selectedDay) ? "bg-primary-dark hover:bg-primary" : ""} ${isSameMonth(d, shownDay) ? "hover:bg-bg cursor-pointer" : "text-text-muted cursor-default"}`}
          >
            {getDate(d)}
          </span>
        ))}
      </div>
    </div>
  );
}
