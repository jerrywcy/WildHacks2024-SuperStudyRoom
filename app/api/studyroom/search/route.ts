import { StudyRoom } from "@prisma/client";
import { NextRequest } from "next/server";

export function GET(request: NextRequest): StudyRoom["Id"][] {
  const searchParams = request.nextUrl.searchParams;

  const dateParam = searchParams.get("date");
  let date: Date | undefined;
  if (!dateParam) date = undefined;
  else date = new Date(dateParam);

  const startParam = searchParams.get("start");
  let start: Date | undefined;
  if (!startParam) start = undefined;
  else start = new Date(startParam);

  const endParam = searchParams.get("end");
  let end: Date | undefined;
  if (!endParam) end = undefined;
  else end = new Date(endParam);

  const timeParam = searchParams.get("time");
  let time: number | undefined;
  if (!timeParam) time = undefined;
  else time = Number(timeParam);

  const capacityParam = searchParams.get("capacity");
  let capacity: number | undefined;
  if (!capacityParam) capacity = undefined;
  else capacity = Number(capacityParam);

  return [];
}
