import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import React from "react";
import StairTransition from "@/components/StairTransition";
import PageTransition from "@/components/PageTransition";
import '@/assets/scss/style.scss';
import NextAuthProvider from "@/provider/NextAuthProvider";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "Task Management System - Organize and Track Your Tasks",
    description: "A powerful task management system designed to help teams create, assign, and manage tasks efficiently. Organize your workflow with role-based access control, task lists, and notifications.",
    keywords: "task management, team collaboration, task lists, assign tasks, task tracking, productivity tool, project management, role-based access control, task software",
    robots: "index, follow",
    twitter: {
        card: "summary_large_image",
        site: "@SaikatRoy",
        title: "Task Management System",
        description: "Simplify task management and collaboration for your team.",
    }
};


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <NextAuthProvider>
            <html lang="en">
                <body
                    className={`${geistSans.variable} ${geistMono.variable} bg-primary`}
                >
                    <StairTransition />
                    <PageTransition>
                        <div className={`transition-all duration-300`}>
                            <div className="grid place-items-center h-screen">
                                {children}
                            </div>
                        </div>
                    </PageTransition>
                </body>
            </html>
        </NextAuthProvider>
    );
}
