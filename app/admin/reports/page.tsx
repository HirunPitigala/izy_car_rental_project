'use client';

import Link from 'next/link';
import { Download, BarChart2 } from 'lucide-react';

export default function ReportsPage() {
    return (
        <div className="container-custom py-8">
            <h1 className="text-2xl font-bold text-[#0f0f0f] mb-2">Reports</h1>
            <p className="text-gray-500 mb-8">Access and manage your system reports</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {/* Download Reports Card */}
                <div className="ek-card flex flex-col items-center justify-center text-center p-10 hover:border-gray-200 cursor-pointer group">
                    <div className="h-16 w-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gray-100 transition-colors">
                        <Download className="h-8 w-8 text-gray-600 group-hover:text-[#0f0f0f] transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold text-[#0f0f0f] mb-2">Download Reports</h3>
                    <p className="text-gray-500 mb-8 max-w-xs">Export your data in CSV or PDF format for offline analysis.</p>
                    <button className="ek-button ek-button-outline w-full max-w-[200px]">
                        Download
                    </button>
                </div>

                {/* View Reports Card */}
                <Link href="/admin/reports/view" className="block h-full">
                    <div className="ek-card flex flex-col items-center justify-center text-center p-10 h-full hover:border-red-100 group transition-all">
                        <div className="h-16 w-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-red-100 transition-colors">
                            <BarChart2 className="h-8 w-8 text-[#dc2626]" />
                        </div>
                        <h3 className="text-xl font-bold text-[#0f0f0f] mb-2">View Reports</h3>
                        <p className="text-gray-500 mb-8 max-w-xs">Visualize your revenue and booking data directly in the dashboard.</p>
                        <span className="ek-button ek-button-secondary w-full max-w-[200px]">
                            View Analytics
                        </span>
                    </div>
                </Link>
            </div>
        </div>
    );
}
