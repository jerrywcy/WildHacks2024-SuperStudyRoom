import prisma, { Reservation, Restriction, StudyRoom } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { PrismaClient } from '@prisma/client'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const dateParam = searchParams.get("start");
  let date: Date;
  if (!dateParam) return Response.error();
  else date = new Date(dateParam);

  const startParam = searchParams.get("start");
  let start: Date;
  if (!startParam) return Response.error();
  else start = new Date(startParam);

  const endParam = searchParams.get("end");
  let end: Date;
  if (!endParam) return Response.error();
  else end = new Date(endParam);

  const timeParam = searchParams.get("time");
  let time: number;
  if (!timeParam) return Response.error();
  else time = Number(timeParam);
  if (time < 0.01) {
    return NextResponse.json("time too small", {status: 400});  }

  const capacityParam = searchParams.get("capacity");
  let capacity: number | undefined;
  if (!capacityParam) capacity = undefined;
  else capacity = Number(capacityParam);
  if (capacity != undefined && capacity <= 0) {
    return NextResponse.json("invalid capacity", {status: 400});
  }

  if (start > end) {
    return NextResponse.json("invalid period", {status: 400});
  }

  //start a client to request StudyRoom data; 
  const prisma = new PrismaClient();

  const roomdata = await prisma.studyRoom.findMany();
  //functions for checks: 

  //change this
  function checkopen(o: Date, c: Date, r: Restriction) {
    if (!(o >= r.Open && c <= r.Close)) {
      return true;
    }
    return false;
  }
  function checkcapacity(c: number | undefined, r: StudyRoom) {
    if (c == undefined) {
      return true;
    }
    if (r.Capacity >= c) {
      return true;
    }
    return false;
  }
  function checklength(c: number | undefined, r: StudyRoom) {
    if (c == undefined) {
      return true;
    }
    if (c <= r.time_limit) {
      return true;
    }
    return false;
  }
  let output: StudyRoom[] = [];
  for (const room of roomdata) {
    const timedata = await prisma.restriction.findMany({
      where: {
        StudyroomId: room.Id
      }
    });
    const resvdata = await prisma.reservation.findMany({
      where: {
        StudyRoomId: room.Id
      }
    }
    );
    resvdata.sort((a, b) => a.Start.getTime() - b.Start.getTime());

    //check for vacancy; no longer needed; 
    //compare
    for (const restr of timedata) {
      if (!checkcapacity(capacity, room) || !checkopen(start, end, restr)) {
        break;
      }
      for (let i = 0; i < resvdata.length - 1; i++) {
        //first check time == undefined
        if (resvdata[i + 1].Start.getTime() - resvdata[i].End.getTime() >= time * 3600 * 1000
          && resvdata[i + 1].Start.getTime() - start.getTime() >= time * 3600 * 1000
          && resvdata[i].End.getTime() - end.getTime() >= time * 3600 * 1000) {
            output.push(room); 
            break;
        }
      }
      break; 
    }
  }
  //
  return output;
}



