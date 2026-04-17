'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, CalendarDays, FileText, TrendingUp, DollarSign, Filter } from 'lucide-react';
import { getMonthlyReportData } from '@/lib/actions/reportActions';
import { generateReportPDF } from '@/lib/utils/reportPdfGenerator';
import PDFViewerModal from '@/components/shared/PDFViewerModal';

export default function MonthlyReportPage() {
    const now = new Date();
    const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1); // 1-indexed
    const [selectedYear, setSelectedYear] = useState(now.getFullYear());
    
    const [reportData, setReportData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - i);

    useEffect(() => {
        fetchReportData();
    }, [selectedMonth, selectedYear]);

    const fetchReportData = async () => {
        setLoading(true);
        const result = await getMonthlyReportData(selectedYear, selectedMonth);
        if (result.success) {
            setReportData(result.data);
        }
        setLoading(false);
    };

    const handleViewPdf = () => {
        if (!reportData) return;
        
        const blob = generateReportPDF({
            title: `Monthly Business Report - ${reportData.month}`,
            range: reportData.month,
            totalRevenue: reportData.totalRevenue,
            totalBookings: reportData.reservations.length,
            reservations: reportData.reservations
        });
        
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
        setIsPdfModalOpen(true);
    };

    return (
        <div className="container-custom py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin/reports/view" className="p-2 -ml-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-[#0f0f0f] transition-colors">
                        <ChevronLeft className="h-6 w-6" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-[#0f0f0f]">Monthly Report</h1>
                        <p className="text-gray-500 text-sm">Comprehensive overview of monthly earnings and bookings</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <select 
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        {months.map((month, index) => (
                            <option key={month} value={index + 1}>{month}</option>
                        ))}
                    </select>
                    <select 
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                    <button 
                        onClick={handleViewPdf}
                        disabled={loading || !reportData || reportData.reservations.length === 0}
                        className="flex items-center gap-2 bg-[#0f0f0f] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FileText className="h-4 w-4" />
                        View PDF Report
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
                </div>
            ) : reportData ? (
                <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="ek-card p-6 border-l-4 border-l-green-100">
                            <p className="text-sm font-medium text-gray-500 mb-1">Monthly Revenue</p>
                            <h3 className="text-2xl font-bold text-[#0f0f0f]">LKR {reportData.totalRevenue.toLocaleString()}</h3>
                            <div className="flex items-center gap-1 mt-2 text-green-600 text-xs font-semibold">
                                <TrendingUp className="h-3 w-3" />
                                <span>Revenue Overview</span>
                            </div>
                        </div>
                        <div className="ek-card p-6 border-l-4 border-l-blue-100">
                            <p className="text-sm font-medium text-gray-500 mb-1">Monthly Bookings</p>
                            <h3 className="text-2xl font-bold text-[#0f0f0f]">{reportData.reservations.length}</h3>
                            <div className="flex items-center gap-1 mt-2 text-blue-600 text-xs font-semibold">
                                <CalendarDays className="h-3 w-3" />
                                <span>Total Volume</span>
                            </div>
                        </div>
                        <div className="ek-card p-6 border-l-4 border-l-amber-100">
                            <p className="text-sm font-medium text-gray-500 mb-1">Projected Annual</p>
                            <h3 className="text-2xl font-bold text-[#0f0f0f]">LKR {(reportData.totalRevenue * 12).toLocaleString()}</h3>
                            <div className="flex items-center gap-1 mt-2 text-amber-600 text-xs font-semibold">
                                <DollarSign className="h-3 w-3" />
                                <span>Est. Forecast</span>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="ek-card overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-bold text-[#0f0f0f]">Monthly Data Log</h3>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Filter className="h-3 w-3" />
                                <span>All transactions</span>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-500 text-xs font-medium uppercase">
                                    <tr>
                                        <th className="px-6 py-4">ID</th>
                                        <th className="px-6 py-4">Customer</th>
                                        <th className="px-6 py-4">Vehicle</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4 text-right">Revenue</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {reportData.reservations.length > 0 ? (
                                        reportData.reservations.map((res: any) => (
                                            <tr key={res.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 text-sm font-medium text-[#0f0f0f]">#{res.id}</td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-[#0f0f0f]">{res.customerName}</div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{res.vehicleNumber}</td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {new Date(res.date).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-sm font-bold text-[#0f0f0f] text-right">
                                                    LKR {parseFloat(res.revenue || "0").toLocaleString()}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-gray-400 text-sm italic">
                                                No transactions found for this month.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-gray-500">Failed to load report data. Please try again.</p>
                </div>
            )}

            {isPdfModalOpen && pdfUrl && (
                <PDFViewerModal 
                    isOpen={isPdfModalOpen}
                    onClose={() => {
                        setIsPdfModalOpen(false);
                        if (pdfUrl) URL.revokeObjectURL(pdfUrl);
                        setPdfUrl(null);
                    }}
                    url={pdfUrl}
                    title={`Monthly Report - ${reportData.month}`}
                />
            )}
        </div>
    );
}
