
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { UserSession } from '@/lib/auth';
import UserProfile from './UserProfile';
import { Bell, ClipboardList } from 'lucide-react';

interface NavItem {
    label: string;
    href: string;
}

const guestNavItems: NavItem[] = [
    { label: 'Rent a Car', href: '/rent' },
    { label: 'Wedding Car Rental', href: '/wedding' },
    { label: 'Airport Rental', href: '/airport' },
    { label: 'Pick Me', href: '/pick-me' },
];

const adminNavItems: NavItem[] = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Requested Bookings', href: '/admin/bookings/requested' },
    { label: 'Vehicles', href: '/admin/vehicles' },
    { label: 'Reservations', href: '/admin/reservations' },
    { label: 'Reports', href: '/admin/reports' },
];

const managerNavItems: NavItem[] = [
    { label: 'Dashboard', href: '/manager/dashboard' },
    { label: 'Daily Reports', href: '/manager/reports/daily' },
    { label: 'Revenue', href: '/manager/reports/revenue' },
    { label: 'Overdue', href: '/manager/reports/overdue' },
    { label: 'Analytics', href: '/manager/analytics' },
];

const customerNavItems: NavItem[] = [
    { label: 'Rent a Car', href: '/rent' },
    { label: 'Wedding Car Rental', href: '/wedding' },
    { label: 'Airport Rental', href: '/airport' },
    { label: 'My Bookings', href: '/customer/bookings' },
    { label: 'Profile', href: '/customer/profile' },
];

interface NavbarProps {
    session: UserSession | null;
}

export default function Navbar({ session }: NavbarProps) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Don't show navbar on login or register pages
    const isAuthPage = pathname === '/login' || pathname.startsWith('/register');
    if (isAuthPage) return null;

    const isActive = (href: string) => pathname === href;

    // Determine nav items based on role
    let currentNavItems = guestNavItems;
    if (session) {
        switch (session.role) {
            case 'admin':
                currentNavItems = adminNavItems;
                break;
            case 'manager':
                currentNavItems = managerNavItems;
                break;
            case 'customer':
                currentNavItems = customerNavItems;
                break;
            default:
                currentNavItems = [];
        }
    }

    return (
        <nav className="sticky top-0 z-50 w-full bg-white shadow-md">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-[72px] items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0 transition-opacity hover:opacity-80">
                        <Image
                            src="/logo.png"
                            alt="IZY Logo"
                            width={120}
                            height={40}
                            className="h-10 w-auto"
                            priority
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden items-center gap-2 md:flex">
                        {currentNavItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 ${isActive(item.href)
                                    ? 'bg-gray-900 text-white shadow-lg'
                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                            >
                                {item.label === 'Requested Bookings' && <ClipboardList className="h-4 w-4" />}
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Auth Buttons / Profile */}
                    <div className="hidden items-center gap-3 md:flex">
                        {session ? (
                            <div className="flex items-center gap-4">
                                {session.role === 'admin' && (
                                    <button className="relative rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900">
                                        <Bell className="h-6 w-6" />
                                        <span className="absolute right-2 top-2 flex h-2.5 w-2.5">
                                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500"></span>
                                        </span>
                                    </button>
                                )}
                                {session.role === 'admin' && (
                                    <div className="relative group">
                                        <button className="rounded-lg bg-[#fbbf24] px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-[#f59e0b] hover:shadow-lg">
                                            Register New
                                        </button>
                                        <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                            <Link href="/register/employee" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Register Employee</Link>
                                            <Link href="/register/manager" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Register Manager</Link>
                                            <Link href="/register/customer" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Register Customer</Link>
                                        </div>
                                    </div>
                                )}
                                <UserProfile session={session} />
                            </div>
                        ) : (
                            <>
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
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#fbbf24] md:hidden"
                        aria-expanded={isMobileMenuOpen}
                    >
                        <span className="sr-only">Open main menu</span>
                        {!isMobileMenuOpen ? (
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        ) : (
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
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
                        {currentNavItems.map((item) => (
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
                            {session ? (
                                <div className="space-y-2">
                                    <div className="px-4 py-2 border rounded-lg bg-gray-50">
                                        <p className="font-semibold">{session.user?.name}</p>
                                        <p className="text-sm text-gray-500 capitalize">{session.role}</p>
                                    </div>
                                    <button
                                        onClick={async () => {
                                            await fetch("/api/auth/logout", { method: "POST" });
                                            window.location.href = "/";
                                        }}
                                        className="block w-full rounded-lg border-2 border-red-500 px-4 py-3 text-center text-base font-semibold text-red-500 hover:bg-red-50"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <>
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
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
