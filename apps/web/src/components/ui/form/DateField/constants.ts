export const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
export const months = [
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
] as const;

import { getYear } from "date-fns";

const currentYear = getYear(new Date());

export const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
