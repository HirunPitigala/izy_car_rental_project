"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to send reset email");
            }

            setSuccess(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#fcfcfc] p-4 font-sans">
            <div className="w-full max-w-[440px]">
                {/* Back to Login */}
                <Link href="/login" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#0f0f0f] transition-colors mb-8 group">
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Back to login
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
                            Forgot Password?
                        </h1>
                        <p className="mt-2.5 text-gray-500">
                            {success
                                ? "Check your email for reset instructions"
                                : "Enter your email and we'll send you a reset link"}
                        </p>
                    </div>

                    {/* Success Message */}
                    {success ? (
                        <div className="space-y-6">
                            <div className="flex items-start gap-3 rounded-xl bg-green-50 p-4 text-sm text-green-700 border border-green-100 animate-in fade-in slide-in-from-top-2">
                                <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold mb-1">Email sent successfully!</p>
                                    <p className="text-green-600">
                                        If an account exists with <strong>{email}</strong>, you will receive a password reset link shortly. Please check your inbox and spam folder.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
                                <p className="font-semibold mb-2">⏰ Link expires in 1 hour</p>
                                <p>For security reasons, the reset link will expire after 1 hour. If you don't receive the email, you can request a new one.</p>
                            </div>

                            <button
                                onClick={() => {
                                    setSuccess(false);
                                    setEmail("");
                                }}
                                className="w-full h-12 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-sm font-bold text-[#0f0f0f] transition-all hover:bg-gray-50 active:scale-[0.98]"
                            >
                                Send another email
                            </button>

                            <Link
                                href="/login"
                                className="block w-full h-12 flex items-center justify-center rounded-xl bg-[#0f0f0f] text-sm font-bold text-white shadow-xl shadow-gray-900/10 transition-all hover:bg-[#262626] active:scale-[0.98]"
                            >
                                Back to login
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
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-[13px] font-bold text-[#0f0f0f] mb-2 px-1"
                                    >
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled={loading}
                                            className="ek-input focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626]/10 pl-12"
                                            placeholder="name@company.com"
                                        />
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    </div>
                                </div>

                                {/* Send Reset Link Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-12 flex items-center justify-center rounded-xl bg-[#dc2626] text-sm font-bold text-white shadow-xl shadow-red-900/10 transition-all hover:bg-[#b91c1c] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                            Sending...
                                        </div>
                                    ) : "Send Reset Link"}
                                </button>
                            </form>

                            {/* Info Box */}
                            <div className="mt-8 bg-blue-50 rounded-xl p-4 text-sm text-blue-700 border border-blue-100">
                                <p className="font-semibold mb-1">💡 Tip</p>
                                <p className="text-blue-600">
                                    Make sure to check your spam folder if you don't see the email in your inbox within a few minutes.
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
