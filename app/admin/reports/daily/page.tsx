'use client';

import Link from 'next/link';
import { ChevronLeft, Banknote, Calendar } from 'lucide-react';
import { mockReservations, dailySummary } from '@/app/admin/reports/mockData';

export default function DailyReportPage() {
    return (
        <div className="container-custom py-8">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/reports/view" className="p-2 -ml-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-[#0f0f0f] transition-colors">
                    <ChevronLeft className="h-6 w-6" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-[#0f0f0f]">Daily Report</h1>
                    <p className="text-gray-500">Detailed transactions for {dailySummary.date}</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="ek-card p-6 flex items-center gap-4">
                    <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                        <Calendar className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Date</p>
                        <p className="text-xl font-bold text-[#0f0f0f]">{dailySummary.date}</p>
                    </div>
                </div>
                <div className="ek-card p-6 flex items-center gap-4">
                    <div className="h-12 w-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                        <Banknote className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
                        <p className="text-xl font-bold text-[#0f0f0f]">LKR {dailySummary.totalRevenue.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Reservations Table */}
            <div className="ek-card overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="font-bold text-[#0f0f0f]">Reservations List</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100 text-left">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Address</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Vehicle</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Revenue</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {mockReservations.map((res) => (
                                <tr key={res.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-[#0f0f0f]">{res.id}</td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-medium text-[#0f0f0f]">{res.customerName}</p>
                                        <p className="text-xs text-gray-500">Lic: {res.licenseNumber}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-[#0f0f0f]">{res.email}</p>
                                        <p className="text-xs text-gray-500">{res.phoneNumber}</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 max-w-[200px] truncate" title={res.address}>
                                        {res.address}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                                            {res.vehicleNumber}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-[#0f0f0f] text-right">
                                        LKR {res.revenue.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
