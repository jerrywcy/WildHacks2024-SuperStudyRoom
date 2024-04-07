import { NextRequest, NextResponse } from "next/server";

import { getOpenIntervalOnDate } from "@/lib/api";
import { PrismaClient } from "@prisma/client";

export async function GET(request: NextRequest) {
  const prisma = new PrismaClient();
  const searchParams = request.nextUrl.searchParams;

  const dateParam = searchParams.get("date");
  let date: Date;
  if (!dateParam)
    return NextResponse.json("No date provided.", { status: 400 });
  else date = new Date(Number(dateParam));

  const studyroomId = Number(searchParams.get("id"));
  const studyroom = await prisma.studyRoom.findUnique({
    where: { id: studyroomId },
  });
  if (!studyroom)
    return NextResponse.json("No studyroom found with the id given.", {
      status: 400,
    });

  const result = await getOpenIntervalOnDate(studyroom, date);

  return NextResponse.json({
    start: result.start.getTime(),
    end: result.end.getTime(),
  });
}
