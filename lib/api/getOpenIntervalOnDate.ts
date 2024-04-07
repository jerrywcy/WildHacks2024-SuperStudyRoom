import { Interval } from "@/lib/types";
import { getDateByTimestamp } from "@/app/utils";
import { PrismaClient, Restriction, StudyRoom } from "@prisma/client";
import dayjs from "dayjs";
import { prisma } from "@/app/consts";

export async function getOpenIntervalOnDate(
  studyroom: StudyRoom,
  date: Date,
  restrictions?: Restriction[],
): Promise<Interval> {
  date = getDateByTimestamp(date);
  if (!restrictions)
    restrictions = await prisma.restriction.findMany({
      where: {
        study_room_id: studyroom.id,
      },
    });
  const res = restrictions
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .filter((restriction) => {
      const resDate = getDateByTimestamp(
        dayjs(restriction.date).add(5, "hour").toDate(),
      );
      if (resDate.getTime() > date.getTime()) return false;
      if (restriction.repetition === "DAY") {
        return true;
      } else if (restriction.repetition === "NONE") {
        return resDate === date;
      } else if (restriction.repetition === "WEEK") {
        return Number.isInteger(dayjs(resDate).diff(dayjs(date), "week", true));
      } else if (restriction.repetition === "MONTH") {
        return Number.isInteger(
          dayjs(resDate).diff(dayjs(date), "month", true),
        );
      } else if (restriction.repetition === "YEAR") {
        return Number.isInteger(dayjs(resDate).diff(dayjs(date), "year", true));
      }
    });
  if (res.length == 0) {
    return {
      start: getDateByTimestamp(date),
      end: new Date(`${dayjs(date).format("YYYY-MM-DD")} 23:59:59`),
    };
  } else {
    const start = dayjs(res[0].open);
    const end = dayjs(res[0].close);
    return {
      start: dayjs(date)
        .set("hour", start.get("hour"))
        .set("minute", start.get("minute"))
        .set("second", start.get("second"))
        .toDate(),
      end: dayjs(date)
        .set("hour", end.get("hour"))
        .set("minute", end.get("minute"))
        .set("second", end.get("second"))
        .toDate(),
    };
  }
}
