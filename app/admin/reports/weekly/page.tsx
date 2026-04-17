'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, CalendarRange, FileText, TrendingUp, BarChart3, Filter } from 'lucide-react';
import { getWeeklyReportData } from '@/lib/actions/reportActions';
import { generateReportPDF } from '@/lib/utils/reportPdfGenerator';
import PDFViewerModal from '@/components/shared/PDFViewerModal';

export default function WeeklyReportPage() {
    const today = new Date().toISOString().split('T')[0];
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const [startDate, setStartDate] = useState(sevenDaysAgo);
    const [endDate, setEndDate] = useState(today);
    const [reportData, setReportData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);

    useEffect(() => {
        fetchReportData();
    }, [startDate, endDate]);

    const fetchReportData = async () => {
        setLoading(true);
        const result = await getWeeklyReportData(startDate, endDate);
        if (result.success) {
            setReportData(result.data);
        }
        setLoading(false);
    };

    const handleViewPdf = () => {
        if (!reportData) return;
        
        const blob = generateReportPDF({
            title: "Weekly Performance Report",
            range: `${startDate} to ${endDate}`,
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
                        <h1 className="text-2xl font-bold text-[#0f0f0f]">Weekly Report</h1>
                        <p className="text-gray-500 text-sm">Analyze performance trends over a custom period</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <span className="text-gray-400 text-sm">to</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
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
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
                </div>
            ) : reportData ? (
                <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="ek-card p-6 border-l-4 border-l-purple-100">
                            <p className="text-sm font-medium text-gray-500 mb-1">Period Revenue</p>
                            <h3 className="text-2xl font-bold text-[#0f0f0f]">LKR {reportData.totalRevenue.toLocaleString()}</h3>
                            <div className="flex items-center gap-1 mt-2 text-purple-600 text-xs font-semibold">
                                <TrendingUp className="h-3 w-3" />
                                <span>Performance Summary</span>
                            </div>
                        </div>
                        <div className="ek-card p-6 border-l-4 border-l-blue-100">
                            <p className="text-sm font-medium text-gray-500 mb-1">Total Bookings</p>
                            <h3 className="text-2xl font-bold text-[#0f0f0f]">{reportData.reservations.length}</h3>
                            <div className="flex items-center gap-1 mt-2 text-blue-600 text-xs font-semibold">
                                <BarChart3 className="h-3 w-3" />
                                <span>Volume Insight</span>
                            </div>
                        </div>
                        <div className="ek-card p-6 border-l-4 border-l-gray-100">
                            <p className="text-sm font-medium text-gray-500 mb-1">Avg. Transaction</p>
                            <h3 className="text-2xl font-bold text-[#0f0f0f]">
                                LKR {(reportData.totalRevenue / (reportData.reservations.length || 1)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </h3>
                            <p className="text-xs text-gray-400 mt-2">Revenue per booking</p>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="ek-card overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-bold text-[#0f0f0f]">Transaction History</h3>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Filter className="h-3 w-3" />
                                <span>Sorted by date</span>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-500 text-xs font-medium uppercase">
                                    <tr>
                                        <th className="px-6 py-4">ID</th>
                                        <th className="px-6 py-4">Customer</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Vehicle No</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Amount</th>
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
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {new Date(res.date).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{res.vehicleNumber}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                        res.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                                                        res.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                        {res.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-bold text-[#0f0f0f] text-right">
                                                    LKR {parseFloat(res.revenue || "0").toLocaleString()}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-sm italic">
                                                No transactions found for this period.
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
                    title="Weekly Performance Report"
                />
            )}
        </div>
    );
}
