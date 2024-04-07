import { Reservation, StudyRoom } from "@prisma/client";
import dayjs from "dayjs"
import { Interval } from "@/lib/types";
import { useEffect, useState } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableHeader, TableRow, TableColumn } from "@nextui-org/table";
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import { TIMEZONE } from "../consts";
import { Button } from "@nextui-org/react";
import { useToggle } from "@uidotdev/usehooks"
import ReserveStudyRoomDialog from "./dialog/ReserveStudyRoomDialog";

export interface SearchResultsProps {
    studyroom: StudyRoom;
    reservations: Reservation[];
    date: Date;
}

export default function SearchResultItem(props: SearchResultsProps) {
    const { studyroom, reservations, date } = props;
    reservations.sort((a, b) => a.start.getTime() - b.start.getTime());
    const [emptyTime, setEmptyTime] = useState<Interval[]>([]);
    const [isOpen, toggleIsOpen] = useToggle();

    useEffect(() => {
        (async () => {
            const { data } = await axios.get<{ start: number, end: number }>("/api/studyroom/getOpenIntervalOnDate", {
                params: {
                    id: studyroom.id,
                    date: date.getTime()
                }
            })
            const openInterval = {
                start: new Date(data.start),
                end: new Date(data.end)
            }
            const list: Interval[] = [];
            if (reservations.length == 0) {
                list.push(openInterval)
            }
            else {
                if (openInterval.start != reservations[0].start)
                    list.push({
                        start: openInterval.start,
                        end: reservations[0].start
                    });
                for (let i = 1; i < reservations.length; i++) {
                    if (reservations[i - 1].end != reservations[i].start) {
                        list.push({
                            start: reservations[i - 1].end,
                            end: reservations[i].start
                        })
                    }
                }
                if (reservations[reservations.length - 1].start != openInterval.end)
                    list.push({
                        start: reservations[reservations.length - 1].end,
                        end: openInterval.end
                    });
            }
            setEmptyTime(list)
        })();
    }, [])

    dayjs.extend(utc)
    dayjs.extend(timezone)

    return <div className="flex flex-row">
        <Table aria-label={`Table of available timeslot for ${studyroom.name}`}>
            <TableHeader>
                <TableColumn>Start</TableColumn>
                <TableColumn>End</TableColumn>
            </TableHeader>
            <TableBody>
                {emptyTime.map(({ start, end }) =>
                (<TableRow
                    key={dayjs(start).format("HH:mm:ss")}
                >
                    <TableCell>{dayjs.tz(start.toString(), TIMEZONE).format("HH:mm:ss")}</TableCell>
                    <TableCell>{dayjs.tz(end.toString(), TIMEZONE).format("HH:mm:ss")}</TableCell>
                </TableRow>)
                )}
            </TableBody>
        </Table>
        <Button color="primary" onPress={() => toggleIsOpen()}> Reserve </Button>
        <ReserveStudyRoomDialog
            studyRoom={studyroom}
            date={date}
            isOpen={isOpen}
            onOpenChange={(open) => { if (open !== isOpen) toggleIsOpen() }}
        />
    </div>
}
