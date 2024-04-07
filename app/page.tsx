'use client'

import { useMemo, useState } from "react"
import dayjs from "dayjs"
import { useRouter } from 'next/navigation';
import { useSearchStore } from '@/lib/store/module/search';
import { Button, Input } from "@nextui-org/react";
import { parseDate } from "chrono-node"

export default function Home() {
    const router = useRouter();
    const searchStore = useSearchStore();
    const [date, setDate] = useState<string>(dayjs().format("YYYY-MM-DD"));
    const [start, setStart] = useState<string>(dayjs().format("HH:mm:ss"));
    const [end, setEnd] = useState<string>(dayjs().add(5, "hour").format("HH:mm:ss"));
    const [time, setTime] = useState<string>("1");
    const [capacity, setCapacity] = useState<string>("1");

    const isDateInvalid = useMemo(() => {
        return parseDate(date) === null;
    }, [date])

    const isStartInvalid = useMemo(() => {
        const startTime = parseDate(start)
        const endTime = parseDate(end)
        return startTime === null ||
            (endTime !== null && startTime.getTime() >= endTime.getTime());
    }, [start, end])

    const isEndInvalid = useMemo(() => {
        const startTime = parseDate(start)
        const endTime = parseDate(end)
        return endTime === null ||
            (startTime !== null && startTime.getTime() >= endTime.getTime());
    }, [end, start])

    const isTimeInvalid = useMemo(() => {
        return isNaN(Number(time)) || Number(time) <= 0.01;
    }, [end])

    const isCapacityInvalid = useMemo(() => {
        return isNaN(Number(capacity)) || Number(capacity) <= 0 || !Number.isInteger(Number(capacity));
    }, [end])

    function onConfirm() {
        if (isDateInvalid || isStartInvalid || isEndInvalid || isTimeInvalid || isCapacityInvalid) {
            return;
        }
        searchStore.setSearch({
            date: parseDate(date) as Date,
            start: parseDate(start) as Date,
            end: parseDate(end) as Date,
            time: Number(time),
            capacity: capacity ? Number(capacity) : undefined
        })
        router.push(`/search`);
    }

    return <main className="flex min-h-screen items-center justify-between p-24">
        <h1> Search </h1>
        <Input
            autoFocus
            label="Date"
            value={date}
            onValueChange={setDate}
            isInvalid={isDateInvalid}
            color={isDateInvalid ? "danger" : "success"}
            errorMessage={isDateInvalid && "Please enter valid date"}
        />
        <Input
            label="Start Time"
            value={start}
            onValueChange={setStart}
            isInvalid={isStartInvalid}
            color={isStartInvalid ? "danger" : "success"}
            errorMessage={isStartInvalid && "Please enter valid start time"}
        />
        <Input
            label="End Time"
            value={end}
            onValueChange={setEnd}
            isInvalid={isEndInvalid}
            color={isEndInvalid ? "danger" : "success"}
            errorMessage={isEndInvalid && "Please enter valid end time"}
        />
        <Input
            label="Interval Length(h)"
            value={time}
            onValueChange={setTime}
            isInvalid={isTimeInvalid}
            color={isTimeInvalid ? "danger" : "success"}
            errorMessage={isTimeInvalid && "Please enter valid end time"}
        />
        <Input
            label="Capacity"
            value={capacity}
            onValueChange={setCapacity}
            isInvalid={isCapacityInvalid}
            color={isCapacityInvalid ? "danger" : "success"}
            errorMessage={isCapacityInvalid && "Please enter valid end time"}
        />
        <Button onClick={onConfirm}>Confirm</Button>
    </main>
}
