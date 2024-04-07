import { PrismaClient, StudyRoom } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const pageParam = searchParams.get("page");
  let page: number | undefined;
  if (pageParam) page = Number(pageParam);
  else page = undefined;

  const countParam = searchParams.get("count");
  let count: number | undefined;
  if (countParam) count = Number(countParam);
  else count = undefined;

  const prisma = new PrismaClient();
  let list: StudyRoom[] = [];
  if (page && count)
    list = await prisma.studyRoom.findMany({
      skip: (page - 1) * count,
      take: count,
    });
  else list = await prisma.studyRoom.findMany();

  return NextResponse.json(list);
}
