'use client'

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState } from "react"
import dayjs, { Dayjs } from "dayjs"
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Button, TextField } from '@mui/material';
import { useRouter } from 'next/navigation';



export default function Home() {
    const router = useRouter();
    const [date, setDate] = useState<Dayjs>(dayjs());
    const [availableTimeRange, setAvailableTimeRage] = useState<{ start: Dayjs, end: Dayjs }>({ start: dayjs(), end: dayjs() })
    const [intervalLength, setIntervalLength] = useState<number>(0);
    const [capacity, setCapacity] = useState<number>(1);

    function onConfirm() {
        router.push("/search");
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <main className="flex min-h-screen items-center justify-between p-24">
                <DatePicker
                    label="Date"
                    value={date}
                    onChange={(date) => {
                        if (date) setDate(date)
                    }}
                />
                <TimePicker
                    label="Available time start"
                    value={availableTimeRange.start}
                    onChange={(time) => {
                        if (time) setAvailableTimeRage({
                            ...availableTimeRange,
                            start: time
                        })
                    }}
                />
                <TimePicker
                    label="Available time end"
                    value={availableTimeRange.end}
                    onChange={(time) => {
                        if (time) setAvailableTimeRage({
                            ...availableTimeRange,
                            end: time
                        })
                    }}
                />
                <TextField
                    label="Time"
                    type="number"
                    defaultValue={0}
                    onChange={(evt) => {
                        if (evt) setIntervalLength(Number(evt.target.value))
                    }}
                />
                <TextField
                    label="Capacity"
                    type="number"
                    defaultValue={1}
                    onChange={(evt) => {
                        if (evt) setCapacity(Number(evt.target.value))
                    }}
                />
                <Button variant="contained" onClick={onConfirm}>Confirm</Button>
            </main>
        </LocalizationProvider>
    );
}
