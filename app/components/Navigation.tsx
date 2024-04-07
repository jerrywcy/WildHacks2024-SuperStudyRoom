'use client'

import { Avatar, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { CalendarRange } from "lucide-react"
import Link from "next/link";
import { useUserStore } from "@/lib/store/module/user";
import { useRouter } from "next/navigation";
import ConfirmLogoutDialog from "./dialog/ConfirmLogoutDialog";
import { $Enums, Account } from "@prisma/client";

export default function Navigation() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const userStore = useUserStore();
    const [user, setUser] = useState<Account | undefined>(userStore.getState().currentUser);
    const router = useRouter();
    useEffect(() => {
        setUser(userStore.state.currentUser);
    }, [userStore.state.currentUser])

    return (
        <>
            <Navbar onMenuOpenChange={setIsMenuOpen}>
                <NavbarContent>
                    <NavbarMenuToggle
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                        className="sm:hidden"
                    />
                    <NavbarBrand>
                        <CalendarRange />
                        <p className="font-bold text-inherit">Super Study Room</p>
                    </NavbarBrand>
                </NavbarContent>
                {user === undefined ?
                    <NavbarContent justify="end">
                        <NavbarItem>
                            <Button as={Link} color="primary" href="/register" variant="flat">
                                Sign Up
                            </Button>
                        </NavbarItem>
                        <NavbarItem>
                            <Button as={Link} color="primary" href="/login" variant="flat">
                                Log In
                            </Button>
                        </NavbarItem>
                    </NavbarContent> :
                    <Dropdown placement="bottom">
                        <DropdownTrigger>
                            <Avatar
                                isBordered
                                as="button"
                                className="transition-transform"
                                name={user.username}
                            />
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label="Profile Actions"
                            variant="flat"
                            onAction={(key) => {
                                if (key === "dashboard") {
                                    router.push("/dashboard")
                                }
                                else if (key === "logout") {
                                    setIsOpen(true)
                                }
                                else if (key === "reservations") {
                                    router.push("/reservations")
                                }
                            }}
                            closeOnSelect
                        >
                            <DropdownItem key="profile" className="h-14 gap-2">
                                <p className="font-semibold">Signed in as</p>
                                <p className="font-semibold">{user.username}</p>
                            </DropdownItem>
                            <DropdownItem key="dashboard">
                                Dashboard
                            </DropdownItem>
                            <DropdownItem key="reservations">
                                My Reservations
                            </DropdownItem>
                            <DropdownItem key="logout" color="danger">
                                Log Out
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                }
            </Navbar>
            <ConfirmLogoutDialog isOpen={isOpen} onOpenChange={setIsOpen} />
        </>
    );
}
