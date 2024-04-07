
'use client'
import { useUserStore } from "@/lib/store/module/user";
import { Button, Modal, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export interface ConfirmLogoutDialogProps {
    isOpen: boolean,
    onOpenChange?: (isOpen: boolean) => void;
}

export default function ConfirmLogoutDialog(props: ConfirmLogoutDialogProps) {
    const { isOpen, onOpenChange } = props;
    const userStore = useUserStore();
    const router = useRouter();
    const user = userStore.state.currentUser;

    const onConfirm = useCallback(async () => {
        await userStore.logout();
        router.push("/");
        router.refresh();
    }, [user])

    return <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
            {(onClose) => (
                <>
                    <ModalHeader className="flex flex-col gap-1">Are you sure to log out of {user?.username ?? ""}?</ModalHeader>
                    <ModalFooter>
                        <Button variant="light" onPress={onClose}> Cancel </Button>
                        <Button color="danger" onPress={() => { onConfirm(); onClose(); }}> Log Out </Button>
                    </ModalFooter>
                </>
            )}
        </ModalContent>
    </Modal>
}
