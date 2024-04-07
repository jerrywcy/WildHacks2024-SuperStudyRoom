import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";

export const WHOLE_DAY = {
  start: dayjs().set("hour", 0).set("minute", 0).set("second", 0).toDate(),
  end: dayjs().set("hour", 23).set("minute", 59).set("second", 59).toDate(),
};

export const TIMEZONE = "America/Chicago";

export const prisma = new PrismaClient();
