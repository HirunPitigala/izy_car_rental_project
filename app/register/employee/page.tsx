"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function PublicCustomerRegistrationPage() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const res = await fetch("/api/register/employee", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: fullName,
                email,
                phone,
                password,
                confirmPassword,
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.error || "Registration failed");
            setLoading(false);
            return;
        }

        // Success
        window.location.href = "/login";
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-lg">

                {/* Logo */}
                <div className="flex justify-center">
                    <Link href="/">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={48}
                            height={48}
                            className="h-12 w-auto object-contain"
                            priority
                        />
                    </Link>
                </div>

                {/* Header */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        Employee Registration
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Create an account to book vehicles
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="rounded-lg bg-red-100 p-2 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form className="space-y-6" onSubmit={handleSubmit}>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <input
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full justify-center rounded-lg bg-yellow-400 px-4 py-2 font-semibold text-black hover:bg-yellow-500 disabled:opacity-50"
                    >
                        {loading ? "Creating..." : "Create Account"}
                    </button>

                </form>

                {/* Login Link */}
                <div className="text-center text-sm">
                    <span className="text-gray-500">Already have an account? </span>
                    <Link href="/login" className="font-semibold text-yellow-500">
                        Login
                    </Link>
                </div>

            </div>
        </div>
    );
}
