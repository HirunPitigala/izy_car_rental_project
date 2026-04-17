'use client';

import Link from 'next/link';
import { Download, BarChart2 } from 'lucide-react';

export default function ReportsPage() {
    return (
        <div className="container-custom py-8">
            <h1 className="text-2xl font-bold text-[#0f0f0f] mb-2">Reports</h1>
            <p className="text-gray-500 mb-8">Access and manage your system reports</p>

            <div className="max-w-md mx-auto">
                {/* View Reports Card */}
                <Link href="/admin/reports/view" className="block h-full">
                    <div className="ek-card flex flex-col items-center justify-center text-center p-12 h-full hover:border-red-100 group transition-all">
                        <div className="h-20 w-20 bg-red-50 rounded-3xl flex items-center justify-center mb-8 group-hover:bg-red-100 transition-colors">
                            <BarChart2 className="h-10 w-10 text-[#dc2626]" />
                        </div>
                        <h3 className="text-2xl font-black text-[#0f0f0f] mb-3 uppercase tracking-tight">View Reports</h3>
                        <p className="text-gray-500 mb-10 max-w-xs text-sm font-medium leading-relaxed">Visualize your revenue and booking data directly in the professional dashboard.</p>
                        <span className="ek-button ek-button-secondary w-full py-4 text-xs font-black uppercase tracking-widest shadow-lg shadow-red-100">
                            View Analytics
                        </span>
                    </div>
                </Link>
            </div>
        </div>
    );
}
