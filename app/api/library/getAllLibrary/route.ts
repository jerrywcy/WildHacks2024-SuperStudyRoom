import { prisma } from "@/app/consts";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const libraries = await prisma.library.findMany();
  return NextResponse.json(libraries);
}
