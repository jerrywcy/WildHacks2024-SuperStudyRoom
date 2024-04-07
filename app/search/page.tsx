'use client'
import { useSearchStore } from "@/lib/store/module/search";
import { SearchResult } from "@/lib/types";
import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import SearchResultItem from "@/app/components/SearchResultItem";
import { Spacer } from "@nextui-org/react";
import { Reservation, StudyRoom } from "@prisma/client";

interface SearchResultResponse {
    studyroom: StudyRoom;
    reservations: ReservationResponse[];
}

type ReservationResponse = Omit<Reservation, "start" | "end"> & { start: string, end: string };

function intoReservation(res: ReservationResponse) {
    return { ...res, start: new Date(res.start), end: new Date(res.end) }
}

export default function Search() {
    const searchStore = useSearchStore();
    const filter = searchStore.state.search
    const [results, setResults] = useState<SearchResult[]>([]);
    useEffect(() => {
        if (filter) {
            const instance = axios.create();
            instance.interceptors.response.use((response: AxiosResponse<SearchResultResponse[]>) => {
                const { data } = response;
                return {
                    ...response,
                    data: data.map((result) => {
                        return {
                            ...result,
                            reservations: result.reservations.map(intoReservation)
                        }
                    })
                }
            })
            instance.get<SearchResult[]>(
                "/api/studyroom/search",
                {
                    params: filter
                },
            ).then(({ data }) => {
                setResults(data)
            })
        }
    }, [])

    return <main className="flex min-h-screen flex-col justify-between p-24">
        {filter !== undefined ?
            results.map(({ studyroom, reservations }) =>
                <div>
                    <h1>{studyroom.name}</h1>
                    <Spacer y={2} />
                    <SearchResultItem
                        studyroom={studyroom}
                        reservations={reservations}
                        date={new Date(filter.date)}
                    />
                    <Spacer y={4} />
                </div>)
            : <p>No Search Result</p>
        }
    </main>
}

