
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { UserSession } from '@/lib/auth';
import UserProfile from './UserProfile';
import { Bell, ClipboardList, Menu, X } from 'lucide-react';

interface NavItem {
    label: string;
    href: string;
}

const guestNavItems: NavItem[] = [
    { label: 'Rent a Car', href: '/rent' },
    { label: 'Wedding Car Rental', href: '/wedding' },
    { label: 'Airport Rental', href: '/airport' },
    { label: 'Pickup Service', href: '/pickup-service' },
];

const adminNavItems: NavItem[] = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Requested Bookings', href: '/admin/bookings/requested' },
    { label: 'Airport Bookings', href: '/admin/bookings/airport-bookings' },
    { label: 'Vehicles', href: '/admin/vehicles' },
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
    { label: 'Pickup Service', href: '/pickup-service' },
];

const employeeNavItems: NavItem[] = [
    { label: 'Requested Bookings', href: '/employee/dashboard' },
];

interface NavbarProps {
    session: UserSession | null;
}

export default function Navbar({ session }: NavbarProps) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
            case 'employee':
                currentNavItems = employeeNavItems;
                break;
            default:
                currentNavItems = [];
        }
    }

    return (
        <nav className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-white'}`}>
            <div className="container-custom">
                <div className="flex h-20 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0 transition-transform hover:scale-[1.02] active:scale-[0.98]">
                        <Image
                            src="/logo.png"
                            alt="IZY Logo"
                            width={110}
                            height={36}
                            className="h-9 w-auto"
                            priority
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden items-center gap-1 lg:flex text-gray-400">
                        {currentNavItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`group relative px-4 py-2 text-sm font-medium transition-colors ${isActive(item.href)
                                    ? 'text-[#0f0f0f]'
                                    : 'text-gray-600 hover:text-[#0f0f0f]'
                                    }`}
                            >
                                <span className="flex items-center gap-2">
                                    {item.label === 'Requested Bookings' && <ClipboardList className="h-4 w-4" />}
                                    {item.label}
                                </span>
                                {isActive(item.href) && (
                                    <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#dc2626] rounded-full" />
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Auth Buttons / Profile */}
                    <div className="hidden items-center gap-4 lg:flex">
                        {session ? (
                            <div className="flex items-center gap-5">
                                {session.role === 'admin' && (
                                    <button className="relative rounded-full p-2 text-gray-500 transition-all hover:bg-gray-100 hover:text-[#0f0f0f]">
                                        <Bell className="h-5 w-5" />
                                        <span className="absolute right-2 top-2 flex h-2 w-2">
                                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600"></span>
                                        </span>
                                    </button>
                                )}
                                {session.role === 'admin' && (
                                    <div className="relative group">
                                        <button className="h-10 px-5 rounded-[10px] bg-[#0f0f0f] text-sm font-semibold text-white transition-all hover:bg-[#262626] active:scale-[0.98]">
                                            Create Account
                                        </button>
                                        <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-white p-1.5 shadow-premium border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                            <Link href="/register/employee" className="flex items-center px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50 hover:text-[#0f0f0f]">Employee Account</Link>
                                            <Link href="/register/manager" className="flex items-center px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50 hover:text-[#0f0f0f]">Manager Account</Link>
                                            <Link href="/register/customer" className="flex items-center px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50 hover:text-[#0f0f0f]">Customer Account</Link>
                                        </div>
                                    </div>
                                )}
                                <UserProfile session={session} />
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/login"
                                    className="h-10 px-5 flex items-center text-sm font-semibold text-[#0f0f0f] transition-all hover:text-gray-600"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href="/register/customer-public"
                                    className="h-10 px-6 rounded-[10px] bg-[#dc2626] flex items-center text-sm font-semibold text-white transition-all shadow-md shadow-red-500/10 hover:bg-[#b91c1c] active:scale-[0.98]"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="inline-flex items-center justify-center rounded-xl p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-[#0f0f0f] lg:hidden"
                        aria-expanded={isMobileMenuOpen}
                    >
                        <span className="sr-only">Open main menu</span>
                        {isMobileMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`fixed inset-x-0 top-20 z-40 lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="bg-white border-b border-gray-100 shadow-xl px-4 pb-8 pt-4">
                    <div className="space-y-1">
                        {currentNavItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-base font-medium transition-all ${isActive(item.href)
                                    ? 'bg-gray-50 text-[#dc2626]'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-[#0f0f0f]'
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                        {session ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 px-4 py-3 border border-gray-100 rounded-2xl bg-gray-50">
                                    <div className="h-10 w-10 rounded-full bg-[#0f0f0f] flex items-center justify-center text-white font-bold">
                                        {session.user?.name?.[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-bold text-[#0f0f0f]">{session.user?.name}</p>
                                        <p className="text-xs text-gray-500 capitalize">{session.role}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={async () => {
                                        await fetch("/api/auth/logout", { method: "POST" });
                                        window.location.href = "/";
                                    }}
                                    className="w-full h-12 rounded-xl border border-gray-200 text-base font-semibold text-gray-600 transition-colors hover:bg-gray-50 active:bg-gray-100"
                                >
                                    Log out
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3">
                                <Link
                                    href="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex h-12 items-center justify-center rounded-xl border border-gray-200 text-base font-semibold text-gray-600 transition-all active:bg-gray-50"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href="/register/customer-public"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex h-12 items-center justify-center rounded-xl bg-[#dc2626] text-base font-semibold text-white shadow-lg shadow-red-500/20 transition-all active:bg-[#b91c1c]"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* Overlay for mobile menu */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 top-20 bg-gray-900/10 backdrop-blur-[2px] z-30 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </nav>
    );
}
