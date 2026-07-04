import { useMemo } from "react";

/**
 * Returns the locale-specific date format pattern (e.g., "MM/dd/yyyy" or "dd/MM/yyyy")
 * The format is determined by the user's locale and remains constant throughout the app lifecycle
 */
export function useLocaleDateFormat(): string {
  return useMemo(() => {
    const parts = new Intl.DateTimeFormat().formatToParts(new Date());
    return parts
      .map((part) => {
        switch (part.type) {
          case "day":
            return "dd";
          case "month":
            return "MM";
          case "year":
            return "yyyy";
          default:
            return part.value;
        }
      })
      .join("");
  }, []); // Empty deps: locale doesn't change during app lifecycle
}
