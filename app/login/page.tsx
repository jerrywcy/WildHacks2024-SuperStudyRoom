'use client'

import { Button, TextField } from "@mui/material";
import { useCallback, useState } from "react";
import axios from "axios"
import { useUserStore } from "@/lib/module/user";
import { Account } from "@prisma/client";
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation";

export default function Login() {
    const userStore = useUserStore();
    const router = useRouter();
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleLogin = useCallback(async () => {
        console.log("aha")
        try {
            const { data } = await axios.post<Account>("/api/user/login", {
                username, password
            })
            userStore.setUser(data);
            router.push("/")
        }
        catch (err: any) {
            toast.error(err.response.data)
        }
    }, [username, password]);

    return <div>
        <TextField
            label="User Name"
            onChange={(evt) => setUsername(evt.target.value)}
            required={true}
        />
        <TextField
            label="Password"
            type="password"
            onChange={(evt) => setPassword(evt.target.value)}
            required={true}
        />
        <Button onClick={handleLogin}>
            Login
        </Button>
    </div>
}
