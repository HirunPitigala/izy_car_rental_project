"use client";

import { Car, CreditCard, Users, AlertCircle, TrendingUp, Calendar, ChevronRight } from "lucide-react";
import StatsCard from "../../admin/dashboard/components/StatsCard";
import Charts from "../../admin/dashboard/components/Charts";
import Link from "next/link";

export default function ManagerDashboard() {
    return (
        <div className="min-h-screen bg-[#fcfcfc] font-sans text-[#0f0f0f] pb-20">
            {/* Header section with Stats Overview */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-20 px-4 py-8 md:px-10">
                <div className="container-custom flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Manager Overview</h1>
                        <p className="mt-2 text-gray-500">Real-time analytics and fleet performance monitoring.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-gray-100" />
                            ))}
                        </div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">+12 active managers</p>
                    </div>
                </div>
            </header>

            <main className="container-custom px-4 py-10 md:px-10">
                {/* Stats Grid */}
                <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <StatsCard
                        label="Total Customers"
                        value="128"
                        icon={Users}
                        trend="+12%"
                    />
                    <StatsCard
                        label="Vehicles on Rent"
                        value="45"
                        icon={Car}
                        trend="+5%"
                    />
                    <StatsCard
                        label="Overdue Vehicles"
                        value="3"
                        icon={AlertCircle}
                        trend="-2%"
                        isNegative
                    />
                    <StatsCard
                        label="Today's Income"
                        value="$2,450"
                        icon={CreditCard}
                        trend="+18%"
                    />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                    {/* Charts Section */}
                    <div className="xl:col-span-2">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-extrabold tracking-tight">Revenue & Performance</h2>
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-[#dc2626]" />
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Monthly Growth</span>
                            </div>
                        </div>
                        <div className="ek-card p-8 border border-gray-100">
                            <Charts />
                        </div>
                    </div>

                    {/* Quick Actions & Recent Bookings */}
                    <div className="space-y-10">
                        <div>
                            <h2 className="text-xl font-extrabold tracking-tight mb-6">Quick Actions</h2>
                            <div className="grid grid-cols-1 gap-4">
                                <Link href="/manager/vehicles/add" className="ek-card p-5 border border-gray-100 flex items-center gap-4 hover:border-red-100 group transition-all">
                                    <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-red-50 group-hover:text-[#dc2626] transition-colors">
                                        <Car className="h-5 w-5" />
                                    </div>
                                    <span className="font-bold text-[15px]">Add New Vehicle</span>
                                    <ChevronRight className="h-4 w-4 text-gray-300 ml-auto group-hover:translate-x-1" />
                                </Link>
                                <button className="ek-card p-5 border border-gray-100 flex items-center gap-4 hover:border-red-100 group transition-all text-left">
                                    <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-red-50 group-hover:text-[#dc2626] transition-colors">
                                        <TrendingUp className="h-5 w-5" />
                                    </div>
                                    <span className="font-bold text-[15px]">Generate Report</span>
                                    <ChevronRight className="h-4 w-4 text-gray-300 ml-auto group-hover:translate-x-1" />
                                </button>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-extrabold tracking-tight mb-6">Pending Requests</h2>
                            <div className="ek-card border border-gray-100 divide-y divide-gray-50">
                                {[1, 2].map((i) => (
                                    <div key={i} className="p-6 flex items-start gap-4">
                                        <div className="h-10 w-10 rounded-full bg-gray-50 shrink-0" />
                                        <div className="flex-1">
                                            <p className="text-sm font-bold">Booking Request #{2456 + i}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">Toyota Camry • 3 Days</p>
                                        </div>
                                        <span className="px-2.5 py-1 rounded-full bg-yellow-50 text-[10px] font-bold text-yellow-600 uppercase">Pending</span>
                                    </div>
                                ))}
                                <Link href="/manager/bookings" className="block w-full text-center py-4 bg-gray-50/50 text-[13px] font-bold text-gray-500 hover:text-[#dc2626] transition-colors">
                                    View All Pending
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div >
    );
}
