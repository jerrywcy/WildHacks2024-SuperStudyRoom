"use client";
import { useUserStore } from "@/lib/store/module/user";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Library, Reservation, StudyRoom } from "@prisma/client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spacer } from "@nextui-org/react";
import dayjs from "dayjs";

type ReservationResponse = Omit<Reservation, "start" | "end"> & { start: string, end: string };

export default function Reservations() {
    const router = useRouter();
    const userStore = useUserStore();
    const user = userStore.state.currentUser;
    if (!user) {
        toast.error("Not Logged In. Log in to see your reservations.");
        router.push("/");
        return;
    }
    const [reservations, setReservations] = useState<ReservationResponse[]>([]);
    const [studyRooms, setStudyRooms] = useState<Map<StudyRoom["id"], StudyRoom>>(new Map());
    const [libraries, setLibraries] = useState<Map<Library["id"], Library>>(new Map());

    useEffect(() => {
        axios
            .get(`/api/reservations/getAllReservationsForUser/${user.username}`)
            .then(({ data }) => {
                setReservations(data);
            });

        axios
            .get<StudyRoom[]>(`/api/studyroom/getAllStudyroom`)
            .then(({ data }) => {
                const map: Map<StudyRoom["id"], StudyRoom> = new Map();
                for (const room of data) {
                    map.set(room.id, room)
                }
                setStudyRooms(map);
            })
        axios
            .get<Library[]>(`/api/library/getAllLibrary`)
            .then(({ data }) => {
                const map: Map<Library["id"], Library> = new Map();
                for (const library of data) {
                    map.set(library.id, library)
                }
                setLibraries(map);
            })
    }, []);

    return <main className="flex min-h-screen flex-col items-center p-24">
        <h2> Reservations </h2>
        <Spacer y={10} />
        <Table aria-label="Table containing all your reservations">
            <TableHeader>
                <TableColumn>Start</TableColumn>
                <TableColumn>End</TableColumn>
                <TableColumn>StudyRoom</TableColumn>
                <TableColumn>Library</TableColumn>
            </TableHeader>
            <TableBody>
                {reservations.map(({ study_room_id, start, end }) => {
                    const studyRoom = studyRooms.get(study_room_id)
                    let library: Library | undefined = undefined;
                    if (studyRoom) library = libraries.get(studyRoom.library_id);
                    return <TableRow key={`${study_room_id}-${start}-${end}`}>
                        <TableCell>{dayjs(start).format("YYYY-MM-DD HH:mm:ss")}</TableCell>
                        <TableCell>{dayjs(end).format("YYYY-MM-DD HH:mm:ss")}</TableCell>
                        <TableCell>{studyRoom?.name ?? "N/A"}</TableCell>
                        <TableCell>{library?.name ?? "N/A"}</TableCell>
                    </TableRow>
                })}
            </TableBody>
        </Table>
    </main>
}
