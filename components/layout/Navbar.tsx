'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface NavItem {
    label: string;
    href: string;
}

const navItems: NavItem[] = [
    { label: 'Rent a Car', href: '/rent' },
    { label: 'Wedding Car Rental', href: '/wedding' },
    { label: 'Airport Rental', href: '/airport' },
    { label: 'Pick Me', href: '/pickme' },
];

export default function Navbar() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isActive = (href: string) => pathname === href;

    return (
        <nav className="sticky top-0 z-50 w-full bg-white shadow-md">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-[72px] items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0 transition-opacity hover:opacity-80">
                        <Image
                            src="/logo.png"
                            alt="Car Rental Logo"
                            width={120}
                            height={40}
                            className="h-10 w-auto"
                            priority
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden items-center gap-2 md:flex">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 ${isActive(item.href)
                                    ? 'bg-gray-900 text-white shadow-lg'
                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden items-center gap-3 md:flex">
                        <Link
                            href="/login"
                            className="rounded-lg border-2 border-[#fbbf24] px-6 py-2.5 text-sm font-semibold text-[#fbbf24] transition-all duration-200 hover:bg-[#fbbf24] hover:text-white"
                        >
                            Login
                        </Link>
                        <Link
                            href="/register/customer-public"
                            className="rounded-lg bg-[#fbbf24] px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-[#f59e0b] hover:shadow-lg"
                        >
                            Register
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#fbbf24] md:hidden"
                        aria-expanded={isMobileMenuOpen}
                    >
                        <span className="sr-only">Open main menu</span>
                        {!isMobileMenuOpen ? (
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        ) : (
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="border-t border-gray-200 bg-white md:hidden">
                    <div className="space-y-1 px-4 pb-3 pt-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`block rounded-lg px-4 py-3 text-base font-medium transition-all duration-200 ${isActive(item.href)
                                    ? 'bg-gray-900 text-white'
                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <div className="mt-4 space-y-2 border-t border-gray-200 pt-4">
                            <Link
                                href="/login"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block rounded-lg border-2 border-[#fbbf24] px-4 py-3 text-center text-base font-semibold text-[#fbbf24] transition-all duration-200 hover:bg-[#fbbf24] hover:text-white"
                            >
                                Login
                            </Link>
                            <Link
                                href="/register/customer-public"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block rounded-lg bg-[#fbbf24] px-4 py-3 text-center text-base font-semibold text-white shadow-md transition-all duration-200 hover:bg-[#f59e0b]"
                            >
                                Register
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
