import { useStore } from "@tanstack/react-form";
import { X } from "lucide-react";
import {
  useState,
  useRef,
  useEffect,
  ChangeEvent,
  KeyboardEvent,
} from "react";

import { useFieldContext } from "@/contexts/form-context";
import FormErrors from "./FormErrors";

export default function DateInputField({ label }: { label: string }) {
  const field = useFieldContext<Date | null>();

  const [day, setDay] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>("");

  const dayRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  const errors = useStore(field.store, (state) => state.meta.errors);

  const sanitizeInput = (value: string, maxLength: number): string => {
    return value.replace(/\D/g, "").slice(0, maxLength);
  };

  const validateAndCommitDate = (
    dayValue: string,
    monthValue: string,
    yearValue: string,
  ) => {
    if (dayValue.length === 2 && monthValue.length === 2 && yearValue.length === 4) {
      const dayNum = parseInt(dayValue, 10);
      const monthNum = parseInt(monthValue, 10);
      const yearNum = parseInt(yearValue, 10);

      if (
        dayNum >= 1 &&
        dayNum <= 31 &&
        monthNum >= 1 &&
        monthNum <= 12 &&
        yearNum >= 1900 &&
        yearNum <= 2099
      ) {
        const date = new Date(yearNum, monthNum - 1, dayNum);

        if (
          date.getDate() === dayNum &&
          date.getMonth() === monthNum - 1 &&
          date.getFullYear() === yearNum
        ) {
          field.handleChange(date);
          return;
        }
      }
    }

    field.handleChange(null);
  };

  const handleDayChange = (e: ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeInput(e.target.value, 2);
    setDay(sanitized);

    if (sanitized.length === 2) {
      monthRef.current?.focus();
    }

    validateAndCommitDate(sanitized, month, year);
  };

  const handleMonthChange = (e: ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeInput(e.target.value, 2);
    setMonth(sanitized);

    if (sanitized.length === 2) {
      yearRef.current?.focus();
    }

    validateAndCommitDate(day, sanitized, year);
  };

  const handleYearChange = (e: ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeInput(e.target.value, 4);
    setYear(sanitized);

    validateAndCommitDate(day, month, sanitized);
  };

  const handleMonthKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && month === "") {
      dayRef.current?.focus();
    }
  };

  const handleYearKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && year === "") {
      monthRef.current?.focus();
    }
  };

  const handleClear = () => {
    setDay("");
    setMonth("");
    setYear("");
    field.handleChange(null);
    dayRef.current?.focus();
  };

  useEffect(() => {
    const fieldValue = field.state.value;

    if (fieldValue instanceof Date && !isNaN(fieldValue.getTime())) {
      setDay(fieldValue.getDate().toString().padStart(2, "0"));
      setMonth((fieldValue.getMonth() + 1).toString().padStart(2, "0"));
      setYear(fieldValue.getFullYear().toString());
    } else if (fieldValue === null) {
      setDay("");
      setMonth("");
      setYear("");
    }
  }, [field.state.value]);

  return (
    <div className="grid">
      <label className="text-text-muted" htmlFor={field.name}>
        {label}
      </label>
      <div
        className="flex items-center gap-1 bg-bg-light border-border text-text-muted rounded-lg border p-2 outline-0"
        id={field.name}
      >
        <input
          ref={dayRef}
          className="w-8 bg-transparent text-center outline-none placeholder:text-text-muted/50"
          placeholder="DD"
          maxLength={2}
          inputMode="numeric"
          aria-label="Day"
          value={day}
          onChange={handleDayChange}
          onBlur={field.handleBlur}
        />
        <span className="text-text-muted/50">/</span>
        <input
          ref={monthRef}
          className="w-8 bg-transparent text-center outline-none placeholder:text-text-muted/50"
          placeholder="MM"
          maxLength={2}
          inputMode="numeric"
          aria-label="Month"
          value={month}
          onChange={handleMonthChange}
          onKeyDown={handleMonthKeyDown}
          onBlur={field.handleBlur}
        />
        <span className="text-text-muted/50">/</span>
        <input
          ref={yearRef}
          className="w-16 bg-transparent text-center outline-none placeholder:text-text-muted/50"
          placeholder="YYYY"
          maxLength={4}
          inputMode="numeric"
          aria-label="Year"
          value={year}
          onChange={handleYearChange}
          onKeyDown={handleYearKeyDown}
          onBlur={field.handleBlur}
        />
        {(day || month || year) && (
          <button
            type="button"
            className="ml-auto"
            onClick={handleClear}
            aria-label="Clear date"
          >
            <X size={16} className="text-text-muted/50 hover:text-text-muted" />
          </button>
        )}
      </div>
      <FormErrors errors={errors} />
    </div>
  );
}
