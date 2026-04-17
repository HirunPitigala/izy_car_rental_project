"use client";

import { useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
} from "recharts";

interface ChartDataItem {
    name: string;
    customers: number;
    reservations: number;
    income: number;
}

interface ChartsProps {
    data: {
        last10Days: ChartDataItem[];
        last30Days: ChartDataItem[];
        last12Months: ChartDataItem[];
    };
    loading?: boolean;
}

export default function Charts({ data: allData, loading }: ChartsProps) {
    const [filter, setFilter] = useState("Last 10 days");

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#dc2626]"></div>
            </div>
        );
    }

    let currentData: ChartDataItem[] = [];
    if (filter === "Last 10 days") {
        currentData = allData?.last10Days || [];
    } else if (filter === "Last 30 days") {
        currentData = allData?.last30Days || [];
    } else {
        currentData = allData?.last12Months || [];
    }

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-premium">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
                    <p className="text-sm font-extrabold text-[#0f0f0f]">
                        {payload[0].name === 'income' ? `LKR ${payload[0].value.toLocaleString()}` : payload[0].value}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-10">
            {/* Filter */}
            <div className="flex justify-end">
                <select
                    className="ek-input py-1.5 px-4 text-xs font-bold border-gray-100 focus:border-[#dc2626] cursor-pointer w-auto"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option>Last 10 days</option>
                    <option>Last 30 days</option>
                    <option>Last 12 months</option>
                </select>
            </div>

            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
                {/* Customers Chart */}
                <div>
                    <h3 className="mb-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-2 border-l-2 border-[#dc2626]">
                        Customer Traffic
                    </h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={currentData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#F3F4F6" />
                                <XAxis
                                    dataKey="name"
                                    stroke="#9CA3AF"
                                    fontSize={10}
                                    fontWeight={600}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="#9CA3AF"
                                    fontSize={10}
                                    fontWeight={600}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Line
                                    type="monotone"
                                    dataKey="customers"
                                    stroke="#dc2626"
                                    strokeWidth={3}
                                    dot={{ r: 0 }}
                                    activeDot={{ r: 6, strokeWidth: 0, fill: "#dc2626" }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Reservations Chart */}
                <div>
                    <h3 className="mb-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-2 border-l-2 border-[#0f0f0f]">
                        Reservations Volume
                    </h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={currentData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#F3F4F6" />
                                <XAxis
                                    dataKey="name"
                                    stroke="#9CA3AF"
                                    fontSize={10}
                                    fontWeight={600}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="#9CA3AF"
                                    fontSize={10}
                                    fontWeight={600}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Line
                                    type="monotone"
                                    dataKey="reservations"
                                    stroke="#0f0f0f"
                                    strokeWidth={3}
                                    dot={{ r: 0 }}
                                    activeDot={{ r: 6, strokeWidth: 0, fill: "#0f0f0f" }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Income Chart */}
            <div>
                <h3 className="mb-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-2 border-l-2 border-[#dc2626]">
                    Revenue Statistics
                </h3>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={currentData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#F3F4F6" />
                            <XAxis
                                dataKey="name"
                                stroke="#9CA3AF"
                                fontSize={10}
                                fontWeight={600}
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                            />
                            <YAxis
                                stroke="#9CA3AF"
                                fontSize={10}
                                fontWeight={600}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `LKR ${value.toLocaleString()}`}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                                type="monotone"
                                dataKey="income"
                                stroke="#dc2626"
                                strokeWidth={3}
                                dot={{ r: 0 }}
                                activeDot={{ r: 6, strokeWidth: 0, fill: "#dc2626" }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
