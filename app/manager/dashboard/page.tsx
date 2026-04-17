"use client";

import { useState, useEffect } from "react";
import { Car, CreditCard, Users, AlertCircle } from "lucide-react";
import StatsCard from "../../admin/dashboard/components/StatsCard";
import Charts from "../../admin/dashboard/components/Charts";

interface AnalyticsData {
    stats: {
        totalCustomersToday: number;
        vehiclesOnRent: number;
        overdueVehicles: number;
        todayIncome: number;
    };
    charts: {
        last10Days: any[];
        last30Days: any[];
        last12Months: any[];
    };
}

export default function ManagerDashboard() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchAnalytics() {
            try {
                const response = await fetch("/api/admin/analytics");
                const result = await response.json();
                if (result.success) {
                    setData(result.data);
                } else {
                    setError(result.error || "Failed to fetch analytics");
                }
            } catch (err) {
                console.error("Error fetching analytics:", err);
                setError("An error occurred while fetching dashboard data.");
            } finally {
                setLoading(false);
            }
        }

        fetchAnalytics();
    }, []);

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 text-center pb-20">
                <div className="bg-white p-8 rounded-2xl border border-red-100 shadow-premium max-w-md w-full">
                    <div className="p-3 bg-red-50 text-red-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
                    <p className="text-gray-500 mb-6">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="w-full ek-button py-2.5"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const stats = data?.stats;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <main className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
                <div className="mb-10">
                    <h1 className="text-3xl font-black text-[#0f0f0f] tracking-tight">Manager Overview</h1>
                    <p className="text-sm text-gray-400 font-medium">Real-time statistics and fleet performance monitoring.</p>
                </div>

                {/* Stats Grid */}
                <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <StatsCard
                        label="Total Customers Today"
                        value={loading ? "..." : (stats?.totalCustomersToday.toString() || "0")}
                        icon={Users}
                    />
                    <StatsCard
                        label="Vehicles on Rent"
                        value={loading ? "..." : (stats?.vehiclesOnRent.toString() || "0")}
                        icon={Car}
                    />
                    <StatsCard
                        label="Overdue Vehicles"
                        value={loading ? "..." : (stats?.overdueVehicles.toString() || "0")}
                        icon={AlertCircle}
                        isNegative={stats && stats.overdueVehicles > 0}
                    />
                    <StatsCard
                        label="Today's Income"
                        value={loading ? "..." : `LKR ${stats?.todayIncome.toLocaleString() || "0"}`}
                        icon={CreditCard}
                    />
                </div>

                {/* Charts Section */}
                <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-premium-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-black text-gray-900 tracking-tight">Revenue Analytics</h3>
                            <p className="text-xs text-gray-400 font-medium">Historical data and growth projections</p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Live View</span>
                        </div>
                    </div>
                    <Charts data={data?.charts || { last10Days: [], last30Days: [], last12Months: [] }} loading={loading} />
                </div>
            </main>
        </div>
    );
}
