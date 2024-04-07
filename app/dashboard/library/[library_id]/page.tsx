import { prisma } from "@/app/consts";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Library({ params }: { params: { library_id: string } }) {
    const library_id = Number(params.library_id);
    if (isNaN(library_id)) notFound();
    const library = await prisma.library.findUnique({ where: { id: Number(params.library_id) } })
    if (!library) notFound();

    const studyRooms = await prisma.studyRoom.findMany({ where: { library_id } });

    return <>
        <h1>{library.name}</h1>
        <b>{library.location}</b>
        <p>{library.desc}</p>
        <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
            {studyRooms.map(async (room) => {
                const reservations = await prisma.reservation.findMany({ where: { study_room_id: room.id } });
                return < Link href={`/dashboard/studyroom/${room.id}`
                } >
                    <Card shadow="sm" key={library.id}>
                        <CardHeader className="flex gap-3">
                            <div className="flex flex-col">
                                <p className="text-md">{room.name}</p>
                            </div>
                        </CardHeader>
                        <CardBody className="overflow-visible p-0">
                            <p className="text-default-500">Reservations:{reservations.length}</p>
                        </CardBody>
                    </Card>
                </Link>
            })}
        </div>
    </>
}
