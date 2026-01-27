import { LucideIcon } from "lucide-react";

interface StatsCardProps {
    label: string;
    value: string;
    icon: LucideIcon;
    trend?: string;
    isNegative?: boolean;
}

export default function StatsCard({ label, value, icon: Icon, trend, isNegative }: StatsCardProps) {
    return (
        <div className="ek-card p-6 border border-gray-100 flex flex-col justify-between h-full hover:shadow-premium transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${isNegative ? 'bg-red-50 text-[#dc2626]' : 'bg-gray-50 text-[#0f0f0f]'}`}>
                    <Icon className="h-5 w-5" />
                </div>
                {trend && (
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${isNegative ? 'bg-red-50 text-[#dc2626]' : 'bg-green-50 text-green-600'}`}>
                        {trend}
                    </span>
                )}
            </div>
            <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-extrabold text-[#0f0f0f]">{value}</h3>
                    {trend && (
                        <span className="text-[10px] text-gray-400 font-medium">vs last month</span>
                    )}
                </div>
            </div>
        </div>
    );
}
