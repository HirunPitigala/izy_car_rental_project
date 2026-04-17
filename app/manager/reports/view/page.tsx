'use client';

import Link from 'next/link';
import { Calendar, CalendarDays, CalendarRange, ChevronLeft } from 'lucide-react';

export default function ViewReportsPage() {
    return (
        <div className="container-custom py-8">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/manager/reports" className="p-2 -ml-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-[#0f0f0f] transition-colors">
                    <ChevronLeft className="h-6 w-6" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-[#0f0f0f]">View Reports</h1>
                    <p className="text-gray-500">Select a time range to view analytics</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Daily Report */}
                <Link href="/manager/reports/daily" className="block h-full">
                    <div className="ek-card h-full p-8 hover:border-red-100 group transition-all">
                        <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                            <Calendar className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-bold text-[#0f0f0f] mb-2">Daily Report</h3>
                        <p className="text-sm text-gray-500">View detailed breakdown for today's transactions and reservations.</p>
                    </div>
                </Link>

                {/* Weekly Report */}
                <Link href="/manager/reports/weekly" className="block h-full">
                    <div className="ek-card h-full p-8 hover:border-red-100 group transition-all">
                        <div className="h-12 w-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-100 transition-colors">
                            <CalendarDays className="h-6 w-6 text-purple-600" />
                        </div>
                        <h3 className="text-lg font-bold text-[#0f0f0f] mb-2">Weekly Report</h3>
                        <p className="text-sm text-gray-500">Analyze performance trends over the current week.</p>
                    </div>
                </Link>

                {/* Monthly Report */}
                <Link href="/manager/reports/monthly" className="block h-full">
                    <div className="ek-card h-full p-8 hover:border-red-100 group transition-all">
                        <div className="h-12 w-12 bg-green-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
                            <CalendarRange className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="text-lg font-bold text-[#0f0f0f] mb-2">Monthly Report</h3>
                        <p className="text-sm text-gray-500">Comprehensive overview of monthly revenue and bookings.</p>
                    </div>
                </Link>
            </div>
        </div>
    );
}
