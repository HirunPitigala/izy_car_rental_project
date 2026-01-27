"use client";

import { Car, Calendar, CreditCard, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CustomerDashboard() {
    const stats = [
        { label: "Active Bookings", value: "2", icon: <Car className="h-5 w-5" />, color: "bg-red-50 text-[#dc2626]" },
        { label: "Points Earned", value: "850", icon: <CreditCard className="h-5 w-5" />, color: "bg-gray-50 text-[#0f0f0f]" },
        { label: "Total Distance", value: "1,240 km", icon: <Calendar className="h-5 w-5" />, color: "bg-gray-50 text-[#0f0f0f]" },
    ];

    return (
        <div className="min-h-screen bg-[#fcfcfc] font-sans text-[#0f0f0f] pb-20">
            {/* Header */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-20 px-4 py-8 md:px-10">
                <div className="container-custom">
                    <h1 className="text-3xl font-extrabold tracking-tight">Dashboard</h1>
                    <p className="mt-2 text-gray-500">Welcome back! Manage your journey and bookings below.</p>
                </div>
            </header>

            <main className="container-custom px-4 py-10 md:px-10">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-12">
                    {stats.map((stat, i) => (
                        <div key={i} className="ek-card p-6 border border-gray-100 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                <p className="text-3xl font-extrabold">{stat.value}</p>
                            </div>
                            <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                                {stat.icon}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Main Content Areas */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-extrabold tracking-tight">Recent Activity</h2>
                                <Link href="/rent/my-bookings" className="text-sm font-bold text-[#dc2626] hover:text-[#b91c1c] flex items-center gap-1 transition-colors">
                                    View All <ChevronRight className="h-4 w-4" />
                                </Link>
                            </div>

                            <div className="ek-card border border-gray-100 overflow-hidden">
                                <div className="p-8 text-center text-gray-500">
                                    <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Calendar className="h-8 w-8 text-gray-300" />
                                    </div>
                                    <p className="font-medium text-lg text-[#0f0f0f] mb-1">No upcoming journeys</p>
                                    <p className="text-sm">Ready to hit the road? Start your next adventure today.</p>
                                    <Link href="/rent" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#dc2626] px-6 py-3 text-sm font-bold text-white transition-all hover:bg-[#b91c1c] active:scale-95 shadow-lg shadow-red-600/20">
                                        Browse Vehicles <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Actions */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-xl font-extrabold tracking-tight mb-6">Special Offers</h2>
                            <div className="ek-card p-6 bg-[#0f0f0f] text-white border-0 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 h-32 w-32 bg-red-600/20 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-red-600/30 transition-colors" />
                                <span className="inline-block px-3 py-1 rounded-full bg-red-600 text-[10px] font-bold uppercase tracking-widest mb-4">Weekend Sale</span>
                                <h3 className="text-2xl font-extrabold mb-2 leading-tight">Get 20% off <br />on SUVs</h3>
                                <p className="text-gray-400 text-sm mb-6">Valid until Jan 30th. Book now to secure this offer.</p>
                                <button className="w-full py-3 rounded-xl bg-white text-[#0f0f0f] text-sm font-bold transition-transform active:scale-[0.98]">
                                    Claim Discount
                                </button>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-extrabold tracking-tight mb-6">Support</h2>
                            <div className="ek-card p-6 border border-gray-100 flex items-center gap-4 hover:border-red-100 transition-colors cursor-pointer group">
                                <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-red-50 group-hover:text-[#dc2626] transition-colors">
                                    <CreditCard className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-bold text-[15px]">Help Center</p>
                                    <p className="text-xs text-gray-400">Manage payment issues</p>
                                </div>
                                <ChevronRight className="h-4 w-4 text-gray-300 ml-auto group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
