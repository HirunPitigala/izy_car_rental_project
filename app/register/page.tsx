"use client";

import Link from "next/link";
import Image from "next/image";

export default function RegisterSelectionPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-lg text-center">
                {/* Logo */}
                <div className="flex justify-center">
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={64}
                        height={64}
                        className="h-16 w-auto object-contain"
                        priority
                    />
                </div>

                {/* Title */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        Choose Registration Type
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Select your role to proceed with registration
                    </p>
                </div>

                {/* Buttons */}
                <div className="space-y-4">
                    <Link
                        href="/register/customer"
                        className="block w-full rounded-lg bg-yellow-400 py-3 text-sm font-semibold text-black shadow-sm transition-colors hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
                    >
                        Customer Registration
                    </Link>
                    <Link
                        href="/register/manager"
                        className="block w-full rounded-lg bg-yellow-400 py-3 text-sm font-semibold text-black shadow-sm transition-colors hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
                    >
                        Manager Registration
                    </Link>
                    <Link
                        href="/register/employee"
                        className="block w-full rounded-lg bg-yellow-400 py-3 text-sm font-semibold text-black shadow-sm transition-colors hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
                    >
                        Employee Registration
                    </Link>
                </div>

                {/* Login Link */}
                <div className="text-sm">
                    <span className="text-gray-500">Already have an account? </span>
                    <Link
                        href="/login"
                        className="font-semibold text-yellow-500 hover:text-yellow-600"
                    >
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
