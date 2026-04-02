"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Check, Chrome, AlertCircle, ArrowLeft } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const normalizedEmail = email.trim().toLowerCase();
            const endpoint = isAdmin ? "/api/auth/admin/login" : "/api/auth/login";
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: normalizedEmail, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Login failed");
            }

            // Small delay to ensure cookies are set before browser navigates
            setTimeout(() => {
                switch (data.role) {
                    case "admin": window.location.replace("/admin/dashboard"); break;
                    case "manager": window.location.replace("/manager/dashboard"); break;
                    case "employee": window.location.replace("/"); break;
                    case "customer": window.location.replace("/"); break;
                    default: window.location.replace("/");
                }
            }, 150);
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#fcfcfc] p-4 font-sans">
            <div className="w-full max-w-[440px]">
                {/* Back to Home */}
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#0f0f0f] transition-colors mb-8 group">
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Back to website
                </Link>

                <div className="rounded-[24px] bg-white p-8 md:p-10 shadow-premium border border-gray-100">
                    {/* Logo & Header */}
                    <div className="mb-10">
                        <Image
                            src="/logo.png"
                            alt="IZY Logo"
                            width={100}
                            height={36}
                            className="h-9 w-auto mb-8"
                            priority
                        />
                        <h1 className="text-2xl font-extrabold text-[#0f0f0f] tracking-tight">
                            {isAdmin ? "Admin Login" : "Welcome Back"}
                        </h1>
                        <p className="mt-2.5 text-gray-500">
                            Please enter your details to sign in
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-8 flex items-center gap-3 rounded-xl bg-red-50 p-4 text-sm text-[#dc2626] border border-red-100 animate-in fade-in slide-in-from-top-2">
                            <AlertCircle className="h-5 w-5 shrink-0" />
                            <span className="font-medium">{error}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-5">
                            {/* Email Field */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-[13px] font-bold text-[#0f0f0f] mb-2 px-1"
                                >
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
                                    disabled={loading}
                                    className="ek-input focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626]/10"
                                    placeholder="name@company.com"
                                />
                            </div>

                            {/* Password Field */}
                            <div>
                                <div className="flex items-center justify-between mb-2 px-1">
                                    <label
                                        htmlFor="password"
                                        className="block text-[13px] font-bold text-[#0f0f0f]"
                                    >
                                        Password
                                    </label>
                                    <Link
                                        href="/forgot-password"
                                        className="text-[12px] font-bold text-[#dc2626] hover:text-[#b91c1c] transition-colors"
                                    >
                                        Forgot?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={loading}
                                        className="ek-input focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626]/10 pr-12"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={loading}
                                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-[#0f0f0f] transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Remember me */}
                        <div className="flex items-center px-1">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                disabled={loading}
                                className="h-4 w-4 rounded border-gray-300 text-[#dc2626] focus:ring-[#dc2626] cursor-pointer"
                            />
                            <label
                                htmlFor="remember-me"
                                className="ml-2.5 block text-sm text-gray-600 cursor-pointer"
                            >
                                Keep me signed in
                            </label>
                        </div>

                        {/* Sign In Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 flex items-center justify-center rounded-xl bg-[#0f0f0f] text-sm font-bold text-white shadow-xl shadow-gray-900/10 transition-all hover:bg-[#262626] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    Signing in...
                                </div>
                            ) : "Sign in to Account"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-100" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
                            <span className="bg-white px-4 text-gray-400">
                                OR
                            </span>
                        </div>
                    </div>

                    {/* Social Login */}
                    <button
                        type="button"
                        disabled={loading}
                        className="flex w-full h-12 items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 text-sm font-bold text-[#0f0f0f] transition-all hover:bg-gray-50 active:scale-[0.98] disabled:opacity-50"
                    >
                        <Image src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width={20} height={20} />
                        Continue with Google
                    </button>

                    {/* Footer */}
                    <div className="mt-10 text-center">
                        <p className="text-sm text-gray-500">
                            Don't have an account?{" "}
                            <Link
                                href="/register/customer-public"
                                className="font-bold text-[#dc2626] hover:text-[#b91c1c] transition-colors"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Admin Toggle */}
                <div className="mt-8 text-center px-4">
                    <button
                        onClick={() => setIsAdmin(!isAdmin)}
                        className="text-[12px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest transition-colors"
                    >
                        {isAdmin ? "Switch to User Login" : "Switch to Admin Access"}
                    </button>
                </div>
            </div>
        </div>
    );
}
