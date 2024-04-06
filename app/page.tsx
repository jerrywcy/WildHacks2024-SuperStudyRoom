'use client'

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState } from "react"
import dayjs, { Dayjs } from "dayjs"
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Unstable_NumberInput as NumberInput } from '@mui/base/Unstable_NumberInput';
import { Button, Input, Select, TextField } from '@mui/material';
import axios from "axios"



export default async function Home() {
    const [date, setDate] = useState<Dayjs>(dayjs());
    const [availableTimeRange, setAvailableTimeRage] = useState<{ start: Dayjs, end: Dayjs }>({ start: dayjs(), end: dayjs() })
    const [intervalLength, setIntervalLength] = useState<number>(0);
    const [capacity, setCapacity] = useState<number>(1);

    async function onConfirm() {
        const result = await axios.get("/api/study_room/search", {
            params: {
                date: date.toDate(),
                start: availableTimeRange.start.toDate(),
                end: availableTimeRange.end.toDate(),
                time: intervalLength,
                capacity
            }
        })
        alert(result.data)
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
