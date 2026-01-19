import { LucideIcon } from "lucide-react";

interface StatsCardProps {
    label: string;
    value: string;
    icon: LucideIcon;
    trend?: string;
}

export default function StatsCard({ label, value, icon: Icon, trend }: StatsCardProps) {
    return (
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">{label}</p>
                    <div className="mt-2 text-3xl font-bold text-green-600">{value}</div>
                </div>
                <div className="rounded-full bg-green-50 p-3">
                    <Icon className="h-6 w-6 text-green-600" />
                </div>
            </div>
            {trend && (
                <div className="mt-4 flex items-center text-sm">
                    <span className="font-medium text-green-600">{trend}</span>
                    <span className="ml-2 text-gray-500">from last month</span>
                </div>
            )}
        </div>
    );
}
