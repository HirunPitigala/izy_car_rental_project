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

const dataLast10Days = [
    { name: "Day 1", customers: 40, reservations: 24, income: 2400 },
    { name: "Day 2", customers: 30, reservations: 13, income: 1398 },
    { name: "Day 3", customers: 20, reservations: 98, income: 9800 },
    { name: "Day 4", customers: 27, reservations: 39, income: 3908 },
    { name: "Day 5", customers: 18, reservations: 48, income: 4800 },
    { name: "Day 6", customers: 23, reservations: 38, income: 3800 },
    { name: "Day 7", customers: 34, reservations: 43, income: 4300 },
];

const dataLastMonth = [
    { name: "Week 1", customers: 240, reservations: 124, income: 12400 },
    { name: "Week 2", customers: 130, reservations: 113, income: 11398 },
    { name: "Week 3", customers: 220, reservations: 198, income: 19800 },
    { name: "Week 4", customers: 270, reservations: 139, income: 13908 },
];

const dataLastYear = [
    { name: "Jan", customers: 400, reservations: 240, income: 24000 },
    { name: "Feb", customers: 300, reservations: 130, income: 13980 },
    { name: "Mar", customers: 200, reservations: 980, income: 98000 },
    { name: "Apr", customers: 270, reservations: 390, income: 39080 },
    { name: "May", customers: 180, reservations: 480, income: 48000 },
    { name: "Jun", customers: 230, reservations: 380, income: 38000 },
    { name: "Jul", customers: 340, reservations: 430, income: 43000 },
    { name: "Aug", customers: 400, reservations: 240, income: 24000 },
    { name: "Sep", customers: 300, reservations: 130, income: 13980 },
    { name: "Oct", customers: 200, reservations: 980, income: 98000 },
    { name: "Nov", customers: 270, reservations: 390, income: 39080 },
    { name: "Dec", customers: 180, reservations: 480, income: 48000 },
];

export default function Charts() {
    const [filter, setFilter] = useState("Last 10 days");

    let data;
    if (filter === "Last 10 days") {
        data = dataLast10Days;
    } else if (filter === "Last 30 days") {
        data = dataLastMonth;
    } else {
        data = dataLastYear;
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
                            <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
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
                            <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
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
                        <LineChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
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
                                tickFormatter={(value) => `LKR ${value}`}
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
