import { getOpenIntervalOnDate } from "@/lib/api/getOpenIntervalOnDate";
import { SearchResult } from "@/lib/types";
import { diff } from "@/app/utils";
import { PrismaClient } from "@prisma/client";
import { prisma } from "@/app/consts";

export async function search(
  date: Date,
  start: Date,
  end: Date,
  time: number,
  capacity?: number,
): Promise<SearchResult[]> {
  const rooms = await prisma.studyRoom.findMany();
  const results: SearchResult[] = [];

  function checkInterval(start: Date, end: Date) {
    return diff(start, end) <= time * 3600;
  }

  for (const room of rooms) {
    if (capacity && room.capacity < capacity) continue;

    const openInterval = await getOpenIntervalOnDate(room, date);
    if (start.getTime() > openInterval.start.getTime())
      openInterval.start = start;
    if (end.getTime() < openInterval.end.getTime()) openInterval.end = end;
    if (diff(openInterval.start, openInterval.end) <= time * 3600) continue;

    let reservations = await prisma.reservation.findMany({
      where: {
        study_room_id: room.id,
      },
    });
    if (
      reservations.filter(
        (reservation) =>
          reservation.start.getTime() <= openInterval.start.getTime() &&
          reservation.end.getTime() >= openInterval.end.getTime(),
      ).length > 0
    )
      continue;

    reservations = reservations
      .sort((a, b) => a.start.getTime() - b.start.getTime())
      .filter(
        (reservation) =>
          reservation.start.getTime() >= openInterval.start.getTime() ||
          reservation.end.getTime() <= openInterval.end.getTime(),
      );

    if (reservations.length === 0) {
      results.push({ studyroom: room, reservations });
      continue;
    }

    if (checkInterval(openInterval.start, reservations[0].start)) {
      results.push({ studyroom: room, reservations });
      continue;
    }
    for (let i = 1; i < reservations.length; i++) {
      if (checkInterval(reservations[i - 1].end, reservations[i].start)) {
        results.push({ studyroom: room, reservations });
        continue;
      }
    }
    if (
      checkInterval(reservations[reservations.length - 1].end, openInterval.end)
    ) {
      results.push({ studyroom: room, reservations });
      continue;
    }
  }
  return results;
}
