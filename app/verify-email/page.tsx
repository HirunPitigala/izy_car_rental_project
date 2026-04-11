"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("Verifying your email...");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Invalid verification link.");
            return;
        }

        const verifyEmail = async () => {
            try {
                const res = await fetch(`/api/auth/verify?token=${token}`);
                const data = await res.json();

                if (res.ok && data.success) {
                    setStatus("success");
                    setMessage("Registered Successfully");
                } else {
                    setStatus("error");
                    setMessage(data.error || "Verification failed. The link may have expired.");
                }
            } catch (error) {
                setStatus("error");
                setMessage("An error occurred. Please try again.");
            }
        };

        verifyEmail();
    }, [token]);

    const handleOkClick = () => {
        router.push("/");
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center">
                {status === "loading" && (
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-16 h-16 text-yellow-500 animate-spin" />
                        <h2 className="text-2xl font-bold text-gray-800">Verifying...</h2>
                        <p className="text-gray-500">Please wait while we verify your email address.</p>
                    </div>
                )}

                {status === "success" && (
                    <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
                        <CheckCircle className="w-20 h-20 text-green-500" />
                        <h2 className="text-2xl font-bold text-gray-800">Success!</h2>
                        <p className="text-lg text-gray-600">{message}</p>
                        <button
                            onClick={handleOkClick}
                            className="mt-4 px-8 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95"
                        >
                            OK
                        </button>
                    </div>
                )}

                {status === "error" && (
                    <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
                        <XCircle className="w-20 h-20 text-red-500" />
                        <h2 className="text-2xl font-bold text-gray-800">Verification Failed</h2>
                        <p className="text-gray-600">{message}</p>
                        <Link
                            href="/login"
                            className="mt-4 px-6 py-2 border-2 border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            Back to Login
                        </Link>
                    </div>
                )}
            </div>

            <div className="mt-8 text-center text-sm text-gray-400">
                &copy; {new Date().getFullYear()} IZY Car Rental. All rights reserved.
            </div>
        </div>
    );
}
