"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ArrowLeft, Briefcase, AlertCircle, Eye, EyeOff } from "lucide-react";

export default function EmployeeRegistrationPage() {
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

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/register/employee", {
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

            window.location.href = "/login";
        } catch (err) {
            console.error(err);
            setError("Something went wrong");
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#fcfcfc] p-4 font-sans text-[#0f0f0f]">
            <div className="w-full max-w-[480px]">
                {/* Back Link */}
                <Link href="/register" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#0f0f0f] transition-colors mb-8 group">
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Back to Selection
                </Link>

                <div className="rounded-[32px] bg-white p-8 md:p-12 shadow-premium border border-gray-100">
                    {/* Logo & Header */}
                    <div className="mb-10 text-center">
                        <Link href="/" className="inline-block mb-8">
                            <Image
                                src="/logo.png"
                                alt="IZY Logo"
                                width={100}
                                height={36}
                                className="h-9 w-auto"
                                priority
                            />
                        </Link>
                        <h1 className="text-2xl font-extrabold tracking-tight">
                            Employee <span className="text-[#dc2626]">Registration</span>
                        </h1>
                        <p className="mt-2.5 text-gray-500">
                            Create a new account for ride logistics
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-8 flex items-center gap-3 rounded-2xl bg-red-50 p-4 text-sm text-[#dc2626] border border-red-100 animate-in fade-in slide-in-from-top-2">
                            <AlertCircle className="h-5 w-5 shrink-0" />
                            <span className="font-medium">{error}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-5">
                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-bold mb-2 px-1">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="ek-input focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626]/10"
                                    placeholder="employee@izy.com"
                                />
                            </div>

                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-bold mb-2 px-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="ek-input focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626]/10 pr-10"
                                        placeholder="••••••••"
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
                                <div className="mt-2 text-xs text-gray-500 space-y-1 pl-1">
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

                            {/* Confirm Password Field */}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-bold mb-2 px-1">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className={`ek-input focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626]/10 pr-10 ${password && confirmPassword && password !== confirmPassword ? "border-red-500 focus:border-red-500" : ""}`}
                                        placeholder="••••••••"
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
                                    <p className="mt-1 text-xs text-red-500 pl-1">Passwords do not match</p>
                                )}
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-[#0f0f0f] text-sm font-bold text-white shadow-xl shadow-gray-900/10 transition-all hover:bg-[#262626] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Briefcase className="h-4 w-4" />
                                        Register Employee
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Login Link */}
                    <div className="mt-10 text-center text-sm border-t border-gray-50 pt-8">
                        <span className="text-gray-500">Already have an account? </span>
                        <Link href="/login" className="font-bold text-[#dc2626] hover:text-[#b91c1c] transition-colors">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
