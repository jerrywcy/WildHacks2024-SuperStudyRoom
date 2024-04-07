// app/providers.tsx
'use client'

import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider as NextThemesProvider } from "next-themes";
import StoreProvider from "./StoreProvider";

export function Providers({ children }: { children: React.ReactNode }) {

    return (
        <StoreProvider>
            <NextUIProvider>
                <NextThemesProvider attribute="class" defaultTheme="dark">
                    {children}
                </NextThemesProvider>
            </NextUIProvider>
        </StoreProvider>
    )
}
