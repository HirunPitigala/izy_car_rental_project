"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, User, ShieldCheck } from "lucide-react";

export default function RegisterSelectionPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#fcfcfc] p-4 font-sans">
            <div className="w-full max-w-md">
                {/* Logo & Header */}
                <div className="text-center mb-10">
                    <Link href="/" className="inline-block mb-8 transition-transform hover:scale-105 active:scale-95">
                        <Image
                            src="/logo.png"
                            alt="IZY Logo"
                            width={120}
                            height={44}
                            className="h-11 w-auto"
                            priority
                        />
                    </Link>
                    <h1 className="text-3xl font-extrabold text-[#0f0f0f] tracking-tight">
                        Create your account
                    </h1>
                    <p className="mt-3 text-gray-500">
                        Select your role below to get started
                    </p>
                </div>

                {/* Selection Cards */}
                <div className="space-y-4">
                    <Link
                        href="/register/customer"
                        className="group relative flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-red-100 hover:shadow-premium hover:-translate-y-1"
                    >
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-[#0f0f0f] transition-colors group-hover:bg-red-50 group-hover:text-[#dc2626]">
                            <User className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-[#0f0f0f]">Customer</h3>
                            <p className="text-sm text-gray-500">I want to rent vehicles</p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-[#dc2626]" />
                    </Link>

                    <Link
                        href="/register/manager"
                        className="group relative flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-red-100 hover:shadow-premium hover:-translate-y-1"
                    >
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-[#0f0f0f] transition-colors group-hover:bg-red-50 group-hover:text-[#dc2626]">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-[#0f0f0f]">Fleet Manager</h3>
                            <p className="text-sm text-gray-500">I want to manage vehicles</p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-[#dc2626]" />
                    </Link>
                </div>

                {/* Footer */}
                <div className="mt-10 text-center">
                    <p className="text-sm text-gray-500">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="font-bold text-[#dc2626] hover:text-[#b91c1c] transition-colors"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
