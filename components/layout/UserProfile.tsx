
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { UserSession } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { LogOut, User, ChevronDown } from "lucide-react";

interface UserProfileProps {
    session: UserSession;
}

export default function UserProfile({ session }: UserProfileProps) {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            alert("You have been logged out");
            router.push("/"); // Redirect home first
            router.refresh(); // Then refresh to update server components
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#fbbf24] focus:ring-offset-2"
            >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                    <User className="h-5 w-5" />
                </div>
                <div className="hidden text-left md:block">
                    <p className="text-xs font-medium text-gray-700">{session.user?.name || "User"}</p>
                    <p className="text-[10px] text-gray-500 capitalize">{session.role}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-30 cursor-default"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 z-40 mt-2 w-56 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="border-b border-gray-100 px-4 py-3">
                            <p className="text-sm font-medium text-gray-900">{session.user?.name || "User"}</p>
                            <p className="truncate text-xs text-gray-500">{session.user?.email || "No email"}</p>
                            <span className="mt-1 inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800 capitalize">
                                {session.role}
                            </span>
                        </div>

                        <div className="py-1">
                            <button
                                onClick={handleLogout}
                                className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Sign out
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
