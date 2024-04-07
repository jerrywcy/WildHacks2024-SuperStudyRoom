import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();
  const prisma = new PrismaClient();
  if (username === undefined)
    return NextResponse.json("Please provide username.", { status: 400 });
  if (password === undefined)
    return NextResponse.json("Please provide password.", { status: 400 });
  const user = await prisma.account.findUnique({
    where: {
      username: username,
    },
  });
  if (user === null) {
    const newUser = await prisma.account.create({
      data: {
        username,
        password,
        role: "USER",
      },
    });
    return NextResponse.json(newUser);
  } else {
    return NextResponse.json(`User ${username} already exsits!`, {
      status: 400,
    });
  }
}
