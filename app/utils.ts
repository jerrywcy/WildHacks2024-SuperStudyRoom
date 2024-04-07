import { createHash } from "crypto";
import dayjs from "dayjs";

export function getDateByTimestamp(date: Date | string): Date {
  return new Date(new Date(date).toDateString());
}

export function diff(start: Date, end: Date, unit: dayjs.UnitType = "second") {
  return dayjs(end).diff(dayjs(start), unit);
}

export function SHA256(s: string): string {
  return createHash("sha256").update(s).digest("hex");
}
