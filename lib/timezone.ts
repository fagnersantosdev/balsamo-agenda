import { toZonedTime } from "date-fns-tz";

export const BRAZIL_TZ = "America/Sao_Paulo";

export function toBrazilDate(date: Date | string) {
  return toZonedTime(new Date(date), BRAZIL_TZ);
}

export function toUTCFromBrazil(date: Date) {
  return new Date(date); 
}

export function startOfBrazilDay(baseDate = new Date()) {
  const date = toZonedTime(baseDate, BRAZIL_TZ);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function endOfBrazilDay(baseDate = new Date()) {
  const date = toZonedTime(baseDate, BRAZIL_TZ);
  date.setHours(23, 59, 59, 999);
  return date;
}