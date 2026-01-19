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

    return (
        <div className="space-y-8">
            {/* Filter */}
            <div className="flex justify-end">
                <select
                    className="rounded-md border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option>Last 10 days</option>
                    <option>Last 30 days</option>
                    <option>Last 12 months</option>
                </select>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Customers Chart */}
                <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">Customers per Day</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis
                                    dataKey="name"
                                    stroke="#9CA3AF"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#9CA3AF"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${value}`}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="customers"
                                    stroke="#16a34a"
                                    strokeWidth={2}
                                    dot={{ r: 4, fill: "#16a34a", strokeWidth: 2 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Reservations Chart */}
                <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">Reservations Overview</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis
                                    dataKey="name"
                                    stroke="#9CA3AF"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#9CA3AF"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="reservations" fill="#16a34a" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Income Chart */}
            <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Income Overview</h3>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis
                                dataKey="name"
                                stroke="#9CA3AF"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#9CA3AF"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `$${value}`}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                formatter={(value) => [`$${value}`, "Income"]}
                            />
                            <Line
                                type="monotone"
                                dataKey="income"
                                stroke="#16a34a"
                                strokeWidth={2}
                                dot={{ r: 4, fill: "#16a34a", strokeWidth: 2 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
