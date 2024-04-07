'use client'
import { useUserStore } from "@/lib/store/module/user";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { StudyRoom } from "@prisma/client"
import axios from "axios";
import { parseDate } from "chrono-node";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";

export interface ReserveStudyRoomDialogProps {
    date: Date;
    studyRoom: StudyRoom;
    isOpen: boolean;
    onOpenChange?: (isOpen: boolean) => void;
}

export default function ReserveStudyRoomDialog(props: ReserveStudyRoomDialogProps) {
    const { studyRoom, date, isOpen, onOpenChange } = props;
    const userStore = useUserStore();
    const router = useRouter();
    const user = userStore.state.currentUser;
    const [start, setStart] = useState<string>(dayjs().format("HH:mm:ss"));
    const [end, setEnd] = useState<string>(dayjs().add(5, "hour").format("HH:mm:ss"));

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
    }, [start, end])

    const onConfirm = useCallback(async () => {
        if (isStartInvalid || isEndInvalid) return;
        if (!user) {
            toast.error("Not logged in. Please log in to reserve study room.")
            router.push("/login")
            return;
        }
        try {
            await axios.post(`/api/studyroom/reserve/${studyRoom.id}`, {
                date: date.getTime(),
                start: (parseDate(start) as Date).getTime(),
                end: (parseDate(end) as Date).getTime(),
                username: user.username,
                password: user.password
            })
            router.push("/")
        }
        catch (error: any) {
            toast.error(error.response.data)
        }
    }, [user, start, end])

    return <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
            {(onClose) => (
                <>
                    <ModalHeader className="flex flex-col gap-1">Reserve {studyRoom.name}</ModalHeader>
                    <ModalBody>
                        {user ?
                            (<>
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
                            </>) :
                            (<>
                                <p>Please log in to reserve study room.</p>
                                <Button onPress={() => router.push("/login")}> Login </Button>
                            </>)
                        }
                    </ModalBody>
                    {
                        user &&
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}> Close </Button>
                            <Button color="primary" onPress={() => { onConfirm(); onClose(); }}> Confirm </Button>
                        </ModalFooter>
                    }
                </>)}
        </ModalContent>
    </Modal>
}
