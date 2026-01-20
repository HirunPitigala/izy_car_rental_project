"use client";

import { Car, CreditCard, Users, AlertCircle } from "lucide-react";
import StatsCard from "./components/StatsCard";
import Charts from "./components/Charts";

export default function AdminDashboard() {
    return (
        <div className="min-h-screen bg-gray-50 pb-8">
            {/* Using global Navbar from layout */}


            <main className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
                <h1 className="mb-8 text-2xl font-bold text-gray-900">Dashboard Overview</h1>

                {/* Stats Grid */}
                <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <StatsCard
                        label="Total Customers Today"
                        value="128"
                        icon={Users}

                    />
                    <StatsCard
                        label="Vehicles on Rent"
                        value="45"
                        icon={Car}

                    />
                    <StatsCard
                        label="Overdue Vehicles"
                        value="3"
                        icon={AlertCircle}

                    />
                    <StatsCard
                        label="Today's Income"
                        value="2,450LKR"
                        icon={CreditCard}

                    />
                </div>

                {/* Charts Section */}
                <Charts />
            </main>
        </div >
    );
}
