"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, CheckCircle, AlertCircle, Lock } from "lucide-react";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [token, setToken] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const tokenParam = searchParams.get("token");
        if (!tokenParam) {
            setError("Invalid reset link. Please request a new password reset.");
        } else {
            setToken(tokenParam);
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validate password match
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        // Validate password strength
        if (password.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to reset password");
            }

            setSuccess(true);

            // Redirect to login after 3 seconds
            setTimeout(() => {
                router.push("/login");
            }, 3000);

        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    if (!token && !error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#fcfcfc] p-4">
                <div className="h-8 w-8 border-4 border-gray-200 border-t-[#dc2626] rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#fcfcfc] p-4 font-sans">
            <div className="w-full max-w-[440px]">
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
                            Reset Password
                        </h1>
                        <p className="mt-2.5 text-gray-500">
                            {success
                                ? "Your password has been reset successfully"
                                : "Enter your new password below"}
                        </p>
                    </div>

                    {/* Success Message */}
                    {success ? (
                        <div className="space-y-6">
                            <div className="flex items-start gap-3 rounded-xl bg-green-50 p-4 text-sm text-green-700 border border-green-100 animate-in fade-in slide-in-from-top-2">
                                <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold mb-1">Password reset successful!</p>
                                    <p className="text-green-600">
                                        You can now login with your new password. Redirecting to login page...
                                    </p>
                                </div>
                            </div>

                            <Link
                                href="/login"
                                className="block w-full h-12 flex items-center justify-center rounded-xl bg-[#0f0f0f] text-sm font-bold text-white shadow-xl shadow-gray-900/10 transition-all hover:bg-[#262626] active:scale-[0.98]"
                            >
                                Go to login
                            </Link>
                        </div>
                    ) : (
                        <>
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
                                    {/* New Password Field */}
                                    <div>
                                        <label
                                            htmlFor="password"
                                            className="block text-[13px] font-bold text-[#0f0f0f] mb-2 px-1"
                                        >
                                            New Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="password"
                                                name="password"
                                                type={showPassword ? "text" : "password"}
                                                autoComplete="new-password"
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                disabled={loading}
                                                className="ek-input focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626]/10 pl-12 pr-12"
                                                placeholder="••••••••"
                                                minLength={8}
                                            />
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
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
                                        <p className="mt-2 text-xs text-gray-500 px-1">
                                            Must be at least 8 characters long
                                        </p>
                                    </div>

                                    {/* Confirm Password Field */}
                                    <div>
                                        <label
                                            htmlFor="confirmPassword"
                                            className="block text-[13px] font-bold text-[#0f0f0f] mb-2 px-1"
                                        >
                                            Confirm Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                type={showConfirmPassword ? "text" : "password"}
                                                autoComplete="new-password"
                                                required
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                disabled={loading}
                                                className="ek-input focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626]/10 pl-12 pr-12"
                                                placeholder="••••••••"
                                                minLength={8}
                                            />
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                disabled={loading}
                                                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-[#0f0f0f] transition-colors"
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff className="h-5 w-5" />
                                                ) : (
                                                    <Eye className="h-5 w-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Reset Password Button */}
                                <button
                                    type="submit"
                                    disabled={loading || !token}
                                    className="w-full h-12 flex items-center justify-center rounded-xl bg-[#dc2626] text-sm font-bold text-white shadow-xl shadow-red-900/10 transition-all hover:bg-[#b91c1c] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                            Resetting...
                                        </div>
                                    ) : "Reset Password"}
                                </button>
                            </form>

                            {/* Footer */}
                            <div className="mt-8 text-center">
                                <Link
                                    href="/login"
                                    className="text-sm text-gray-500 hover:text-[#0f0f0f] transition-colors"
                                >
                                    Back to login
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center bg-[#fcfcfc] p-4">
                <div className="h-8 w-8 border-4 border-gray-200 border-t-[#dc2626] rounded-full animate-spin" />
            </div>
        }>
            <ResetPasswordForm />
        </Suspense>
    );
}
