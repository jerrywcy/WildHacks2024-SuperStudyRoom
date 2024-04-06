'use client'

import { StudyRoom } from "@prisma/client";
import { NextRequest } from "next/server";
import { useEffect, useState } from "react"
import SearchResults from "./results";

type StudyRoomId = StudyRoom["Id"];

export default function Search(request: NextRequest) {
    return <>
        <SearchResults />
    </>
}

