import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { username, password, start, end } = await request.json();
  const prisma = new PrismaClient();

  const user = await prisma.account.findUnique({
    where: {
      username,
    },
  });

  if (!user)
    return NextResponse.json(
      "No user found with username and password given.",
      {
        status: 400,
      },
    );
  if (user.password != password)
    return NextResponse.json("Wrong Password.", {
      status: 400,
    });

  const id = Number(params.id);
  const room = await prisma.studyRoom.findUnique({ where: { id } });
  if (!room)
    return NextResponse.json("No room found with id provided.", {
      status: 400,
    });

  const reservation = await prisma.reservation.create({
    data: {
      username,
      study_room_id: id,
      start: new Date(start),
      end: new Date(end),
    },
  });
  return NextResponse.json(reservation);
}
