import { NextRequest, NextResponse } from "next/server";

import { search } from "@/lib/api";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const dateParam = searchParams.get("date");
  let date: Date;
  if (!dateParam) return Response.json("No date provided.", { status: 400 });
  else date = new Date(Number(dateParam));

  const startParam = searchParams.get("start");
  let start: Date;
  if (!startParam)
    return Response.json("No start time provided.", { status: 400 });
  else start = new Date(Number(startParam));

  const endParam = searchParams.get("end");
  let end: Date;
  if (!endParam) return Response.json("No end time provided", { status: 400 });
  else end = new Date(Number(endParam));

  const timeParam = searchParams.get("time");
  let time: number;
  if (!timeParam) return Response.error();
  else time = Number(timeParam);
  if (time < 0.01) {
    return NextResponse.json("Time too small", { status: 400 });
  }

  const capacityParam = searchParams.get("capacity");
  let capacity: number | undefined;
  if (!capacityParam) capacity = undefined;
  else capacity = Number(capacityParam);
  if (capacity != undefined && capacity <= 0) {
    return NextResponse.json("Invalid capacity", { status: 400 });
  }

  if (start > end) {
    return NextResponse.json("Invalid period", { status: 400 });
  }

  return NextResponse.json(await search(date, start, end, time, capacity));
}
