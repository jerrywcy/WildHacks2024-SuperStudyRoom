import { useUserStore } from "@/lib/store/module/user";
import { Account } from "@prisma/client";

export default function Dashboard() {
    const userStore = useUserStore();
    const user = userStore.state.currentUser;

}
