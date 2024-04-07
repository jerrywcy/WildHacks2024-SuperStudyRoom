import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';
import StoreProvider from "./StoreProvider";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Super Study Room",
    description: "Self-hosted study room reservation management system for universities with various features and customizations.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <html lang="en" className="dark">
            <Toaster />
            <body className={inter.className}>
                <StoreProvider>
                    <AppRouterCacheProvider>
                        <ThemeProvider theme={theme}>
                            {children}
                        </ThemeProvider>
                    </AppRouterCacheProvider>
                </StoreProvider>
            </body>
        </html>
    );
}
