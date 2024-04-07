'use client'

import { useCallback, useState } from "react";
import axios from "axios"
import { useUserStore } from "@/lib/store/module/user";
import { Account } from "@prisma/client";
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation";
import { Button, Input } from "@nextui-org/react";
import { SHA256 } from "../utils";

export default function Register() {
    const userStore = useUserStore();
    const router = useRouter();
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleRegister = useCallback(async () => {
        try {
            const { data } = await axios.post<Account>("/api/user/register", {
                username, password: SHA256(password)
            })
            userStore.login(data);
            router.push("/")
        }
        catch (err: any) {
            toast.error(err.response.data)
        }
    }, [username, password]);

    return <main className="flex min-h-screen flex-col items-center justify-between p-24 min-w-4">
        <h1> Login </h1>
        <Input
            label="User Name"
            onValueChange={setUsername}
            required={true}
            isClearable={true}
            onClear={() => {
                setUsername("");
                setPassword("");
            }}
        />
        <Input
            label="Password"
            type="password"
            onValueChange={setPassword}
            required={true}
        />
        <Button onClick={handleRegister}>
            Register
        </Button>
    </main>
}
