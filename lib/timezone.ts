// lib/timezone.ts
import { toZonedTime } from "date-fns-tz";

export const BRAZIL_TZ = "America/Sao_Paulo";

/**
 * Converte uma data UTC para horário do Brasil
 */
export function toBrazilDate(date: Date) {
  return toZonedTime(date, BRAZIL_TZ);
}

/**
 * Converte uma data do Brasil para UTC
 * (ajuste manual confiável, sem dependência de API removida)
 */
export function toUTCFromBrazil(date: Date) {
  const zoned = toZonedTime(date, BRAZIL_TZ);
  const offset = zoned.getTimezoneOffset() * 60 * 1000;
  return new Date(zoned.getTime() + offset);
}

/**
 * Início do dia no Brasil (00:00) → retorna em UTC
 */
export function startOfBrazilDay(baseDate = new Date()) {
  const local = toZonedTime(baseDate, BRAZIL_TZ);
  local.setHours(0, 0, 0, 0);

  const offset = local.getTimezoneOffset() * 60 * 1000;
  return new Date(local.getTime() + offset);
}

/**
 * Fim do dia no Brasil (23:59:59.999) → retorna em UTC
 */
export function endOfBrazilDay(baseDate = new Date()) {
  const local = toZonedTime(baseDate, BRAZIL_TZ);
  local.setHours(23, 59, 59, 999);

  const offset = local.getTimezoneOffset() * 60 * 1000;
  return new Date(local.getTime() + offset);
}