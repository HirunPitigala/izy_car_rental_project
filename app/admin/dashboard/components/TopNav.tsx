"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell, Search, Settings, User, LogOut, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface NavItem {
    name: string;
    href: string;
    active: boolean;
}

interface TopNavProps {
    title?: string;
    items?: NavItem[];
}

export default function TopNav({
    title = "Admin",
    items = [
        { name: "Dashboard", href: "/admin/dashboard", active: true },
        { name: "Reports", href: "#", active: false },
    ]
}: TopNavProps) {
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            router.push("/login");
        } catch (error) {
            console.error("Sign out error:", error);
        }
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Left: Logo & Nav Links */}
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex flex-shrink-0 items-center gap-2">
                        <div className="relative h-8 w-8">
                            <Image
                                src="/logo.png"
                                alt="Logo"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                        <span className="text-lg font-bold text-gray-900">{title}</span>
                    </Link>

                    <div className="hidden md:block">
                        <div className="flex space-x-4">
                            {items.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${item.active
                                        ? "bg-green-50 text-green-700"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/login"
                        className="rounded-full bg-yellow-400 px-4 py-2 text-sm font-semibold text-black shadow-sm transition-colors hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
                    >
                        Login
                    </Link>
                    <Link
                        href="/register"
                        className="rounded-full bg-yellow-400 px-4 py-2 text-sm font-semibold text-black shadow-sm transition-colors hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
                    >
                        Register
                    </Link>
                    <button className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900">
                        <Search className="h-5 w-5" />
                    </button>
                    <button className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900">
                        <Bell className="h-5 w-5" />
                    </button>
                    <button className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900">
                        <Settings className="h-5 w-5" />
                    </button>

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                            className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-2 text-green-700 hover:bg-green-200 transition-colors"
                        >
                            <User className="h-5 w-5" />
                            <ChevronDown className="h-4 w-4" />
                        </button>

                        {/* Dropdown Menu */}
                        {showProfileDropdown && (
                            <>
                                {/* Backdrop to close dropdown */}
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowProfileDropdown(false)}
                                />

                                {/* Dropdown Content */}
                                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-premium border border-gray-100 py-2 z-20 animate-in fade-in slide-in-from-top-2">
                                    <button
                                        onClick={handleSignOut}
                                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Sign Out
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
