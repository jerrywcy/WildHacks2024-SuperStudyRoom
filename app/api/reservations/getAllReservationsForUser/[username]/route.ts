import { prisma } from "@/app/consts";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: { username: string } },
) {
  const { username } = params;
  const reservations = await prisma.reservation.findMany({
    where: {
      username,
    },
  });
  return NextResponse.json(reservations);
}
