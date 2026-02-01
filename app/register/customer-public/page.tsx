"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function PublicCustomerRegistrationPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const res = await fetch("/api/register/customer-public", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email,
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
                        Customer Registration
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
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-1 focus:ring-yellow-400"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-1 focus:ring-yellow-400 pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                        <div className="mt-2 text-xs text-gray-500 space-y-1">
                            <p>Must contain:</p>
                            <ul className="list-disc pl-4 space-y-0.5">
                                <li className={/[A-Z]/.test(password) ? "text-green-600" : "text-gray-500"}>1 Uppercase letter</li>
                                <li className={/[a-z]/.test(password) ? "text-green-600" : "text-gray-500"}>1 Lowercase letter</li>
                                <li className={/\d/.test(password) ? "text-green-600" : "text-gray-500"}>1 Number</li>
                                <li className={/[@$!%*?&#^()_\-+=\[\]{};:'",.<>\/|`~]/.test(password) ? "text-green-600" : "text-gray-500"}>1 Special character</li>
                                <li className={password.length >= 8 && password.length <= 64 ? "text-green-600" : "text-gray-500"}>8-64 Characters</li>
                            </ul>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className={`mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-1 focus:ring-yellow-400 pr-10 ${password && confirmPassword && password !== confirmPassword ? "border-red-500 focus:border-red-500" : ""}`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                        {password && confirmPassword && password !== confirmPassword && (
                            <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full justify-center rounded-lg bg-yellow-400 px-4 py-2 font-semibold text-black hover:bg-yellow-500 disabled:opacity-50 transition-colors"
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
