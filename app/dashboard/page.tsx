import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import { prisma } from "../consts";
import Link from "next/link";

export default async function Dashboard() {
    const libraries = await prisma.library.findMany();

    return <>
        <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
            {libraries.map(async (library) => {
                const studyRooms = await prisma.studyRoom.count({ where: { library_id: library.id } })
                return <Link href={`/dashboard/library/${library.id}`} >
                    <Card shadow="sm" key={library.id}>
                        <CardBody className="overflow-visible p-0">
                            <Image
                                shadow="sm"
                                radius="lg"
                                width="100%"
                                alt={library.name}
                                className="w-full object-cover h-[140px]"
                                src={library.photo}
                            />
                        </CardBody>
                        <CardFooter className="text-small justify-between">
                            <b>{library.name}</b>
                            <p className="text-default-500">Study Rooms:{studyRooms}</p>
                        </CardFooter>
                    </Card>
                </Link>
            })}
        </div>
    </>
}
