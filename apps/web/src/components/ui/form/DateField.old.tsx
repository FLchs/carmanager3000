import { useStore } from "@tanstack/react-form";
import {
  addMonths,
  differenceInDays,
  endOfMonth,
  format,
  getDate,
  getDay,
  getDaysInMonth,
  getMonth,
  nextSunday,
  parseISO,
  previousMonday,
  startOfMonth,
} from "date-fns";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { uuid } from "zod/v4";

import { useFieldContext } from "../../../contexts/form-context";
import FormErrors from "./FormErrors";

function Day({ day, selected, onClick }: { day: number; selected: boolean; onClick: () => void }) {
  return (
    <td
      className={` text-center cursor-pointer hover:bg-bg rounded-lg ${selected && "bg-primary-dark"} p-1`}
      onClick={onClick}
    >
      {day}
    </td>
  );
}

function Th({ children }: { children: ReactNode }) {
  return <th className="p-1 text-center">{children}</th>;
}

function generate(date: Date) {
  const start = getDate(previousMonday(startOfMonth(date)));
  const end = differenceInDays(startOfMonth(date), previousMonday(startOfMonth(date)));
  const nb: Array<{ day: number; disable: boolean }> = [];

  console.log(start, start + end);
  if (end < 7) {
    for (let index = start; index < start + end; index++) {
      nb.push({ day: index, disable: true });
    }
  }

  for (let index = 0; index < getDaysInMonth(date); index++) {
    nb.push({ day: index + 1, disable: false });
  }

  for (let index = 0; index < getDate(nextSunday(endOfMonth(date))); index++) {
    nb.push({ day: index + 1, disable: true });
  }

  return nb;
}

export default function DateField({ label }: { label: string }) {
  const field = useFieldContext<Date | string>();

  const errors = useStore(field.store, (state) => state.meta.errors);

  const [selectedDay, setSelectedDay] = useState<undefined | number>();
  const [date, setDate] = useState(new Date());

  return (
    <div className="grid">
      <label className="text-text-muted" htmlFor={field.name}>
        {label}
      </label>
      <div className="flex flex-row relative">
        <div className="absolute z-10 top-full bg-bg-light rounded-lg p-2 mt-2 border border-bg-dark">
          <div className="grid grid-cols-7 text-center gap-2">
            <div className="col-span-7 flex flex-row justify-between">
              <span onClick={() => setDate(addMonths(date, -1))}>
                <ArrowLeft />
              </span>
              <span>{format(date, "MMMM")}</span>
              <span onClick={() => setDate(addMonths(date, 1))}>
                <ArrowRight />
              </span>
            </div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
            <div>Sun</div>

            {generate(date).map(({ day, disable }) => (
              <div
                key={Math.random()}
                className={`rounded-lg ${disable ? "cursor-default text-text-muted" : "cursor-pointer hover:bg-bg"} ${selectedDay === day ? "bg-primary-dark" : ""}`}
                onClick={() => setSelectedDay(day)}
              >
                {day}
              </div>
            ))}

            {/* {Array.from({ length: getDaysInMonth(date) }, (_value, index) => index + 1).map((d) => { */}
            {/*   return ( */}
            {/*     <div */}
            {/*       key={d} */}
            {/*       className={`hover:bg-bg px-1 py-0.5 rounded-lg text-center cursor-pointer ${selectedDay === d ? "bg-primary-dark" : ""}`} */}
            {/*       onClick={() => setSelectedDay(d)} */}
            {/*     > */}
            {/*       {d} */}
            {/*     </div> */}
            {/*   ); */}
            {/* })} */}
          </div>
        </div>
        <div className="flex flex-row relative w-full">
          <input
            className="bg-bg-light border-border text-text-muted rounded-lg border p-2 outline-0"
            id={field.name}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(parseISO(e.target.value))}
            type="date"
            value={field.state.value === "" ? "" : format(field.state.value, "yyyy-MM-dd")}
          />
          <div className="absolute right-0 flex flex-row h-full">
            <div className="flex flex-col m-auto">
              <X
                className="h-6 w-6 py-1 mr-1.5 cursor-pointer"
                onClick={() => field.setValue("")}
              />
            </div>
          </div>
        </div>
      </div>

      <FormErrors errors={errors} />
    </div>
  );
}
