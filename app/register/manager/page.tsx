"use client";

import Link from "next/link";
import Image from "next/image";

export default function ManagerRegistrationPage() {
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
                        Manager Registration
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Create an account to manage operations
                    </p>
                </div>

                {/* Form */}
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <div>
                        <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">Full Name</label>
                        <div className="mt-1">
                            <input id="fullname" name="fullname" type="text" required className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400 sm:text-sm" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                        <div className="mt-1">
                            <input id="email" name="email" type="email" autoComplete="email" required className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400 sm:text-sm" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <div className="mt-1">
                            <input id="phone" name="phone" type="tel" autoComplete="tel" required className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400 sm:text-sm" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <div className="mt-1">
                            <input id="password" name="password" type="password" required className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400 sm:text-sm" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <div className="mt-1">
                            <input id="confirmPassword" name="confirmPassword" type="password" required className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400 sm:text-sm" />
                        </div>
                    </div>


                    <button type="submit" className="flex w-full justify-center rounded-lg bg-yellow-400 px-4 py-2 text-sm font-semibold text-black shadow-sm transition-colors hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2">
                        Register
                    </button>
                </form>

                {/* Login Link */}
                <div className="text-center text-sm">
                    <span className="text-gray-500">Already have an account? </span>
                    <Link href="/login" className="font-semibold text-yellow-500 hover:text-yellow-600">
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
