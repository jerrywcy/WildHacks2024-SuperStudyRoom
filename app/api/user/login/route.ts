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
    return NextResponse.json(
      "No user found with the user name and password provided.",
      { status: 400 },
    );
  } else if (password != user.password) {
    return NextResponse.json("Wrong password.", { status: 400 });
  } else {
    return NextResponse.json(user);
  }
}
