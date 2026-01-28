
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { UserSession } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { LogOut, User, ChevronDown, Settings, CreditCard } from "lucide-react";

interface UserProfileProps {
    session: UserSession;
}

export default function UserProfile({ session }: UserProfileProps) {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            router.push("/");
            router.refresh();
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-3 py-1.5 transition-all hover:bg-gray-50 hover:border-gray-200 active:scale-[0.98] focus:outline-none"
            >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0f0f0f] text-white font-bold text-xs">
                    {session.user?.name?.[0].toUpperCase() || "U"}
                </div>
                <div className="hidden text-left md:block">
                    <p className="text-[13px] font-bold text-[#0f0f0f] leading-tight">{session.user?.name || "User"}</p>
                    <p className="text-[11px] text-gray-500 capitalize leading-tight">{session.role}</p>
                </div>
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-30 cursor-default"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 z-40 mt-2 w-64 origin-top-right rounded-2xl bg-white p-1.5 shadow-premium border border-gray-100 focus:outline-none animate-in fade-in zoom-in duration-200">
                        <div className="px-4 py-4 mb-1 border-b border-gray-50">
                            <p className="text-[14px] font-bold text-[#0f0f0f]">{session.user?.name || "User"}</p>
                            <p className="truncate text-[12px] text-gray-500">{session.user?.email || "No email"}</p>
                            <div className="mt-2.5">
                                <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-[11px] font-bold text-[#dc2626] capitalize">
                                    {session.role}
                                </span>
                            </div>
                        </div>



                        <div className="mt-1 pt-1 border-t border-gray-50">
                            <button
                                onClick={handleLogout}
                                className="flex w-full items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            >
                                <LogOut className="h-4 w-4" />
                                Sign out
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
