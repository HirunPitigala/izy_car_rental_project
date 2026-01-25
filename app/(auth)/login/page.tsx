"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Check, Chrome, AlertCircle } from "lucide-react";

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
            const endpoint = "/api/auth/login";
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Login failed");
            }

            // Force refresh to update the server-rendered Navbar with the new session
            router.refresh();

            // Redirect based on role
            switch (data.role) {
                case "admin": router.push("/admin/dashboard"); break;
                case "manager": router.push("/manager/dashboard"); break;
                case "employee": router.push("/employee/dashboard"); break;
                case "customer": router.push("/customer/dashboard"); break;
                default: throw new Error("Unknown role");
            }
        } catch (err: any) {
            setError(err.message);
            setLoading(false); // Only stop loading on error, on success we redirect so keep loading state to prevent double submit
        }
        // Note: We don't set loading(false) on success to prevent flashes before redirect
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-lg">
                {/* Logo */}
                <div className="flex justify-start">
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={48}
                        height={48}
                        className="h-12 w-auto object-contain"
                        priority
                    />
                </div>

                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        {isAdmin ? "Admin Login" : "Welcome Back"}
                    </h1>
                    <p className="text-sm text-gray-500">
                        Enter your credentials to access your account
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-500">
                        <AlertCircle className="h-4 w-4" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Form */}
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* Email Field */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400 sm:text-sm disabled:opacity-50"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Password
                            </label>
                            <div className="relative mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 shadow-sm focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400 sm:text-sm disabled:opacity-50"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={loading}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" aria-hidden="true" />
                                    ) : (
                                        <Eye className="h-5 w-5" aria-hidden="true" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>




                    {/* Remember me & Forgot password */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                disabled={loading}
                                className="h-4 w-4 rounded border-gray-300 text-yellow-400 focus:ring-yellow-400"
                            />
                            <label
                                htmlFor="remember-me"
                                className="ml-2 block text-sm text-gray-700"
                            >
                                Remember me
                            </label>
                        </div>

                        <div className="text-sm">
                            <Link
                                href="#"
                                className="font-medium text-gray-600 hover:text-gray-900"
                            >
                                Forgot password?
                            </Link>
                        </div>
                    </div>

                    {/* Sign In Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full justify-center rounded-lg bg-yellow-400 px-4 py-2 text-sm font-semibold text-black shadow-sm transition-colors hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                {/* Divider */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-white px-2 text-gray-500">
                            Or continue with
                        </span>
                    </div>
                </div>

                {/* Social Login */}
                <div>
                    <button
                        type="button"
                        disabled={loading}
                        className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 disabled:opacity-50"
                    >
                        {/* Google Icon SVG */}
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Sign in with Google
                    </button>
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-gray-500">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/register/customer-public"
                        className="font-semibold text-yellow-500 hover:text-yellow-600"
                    >
                        Sign up
                    </Link>
                </p>
            </div >
        </div >
    );
}
