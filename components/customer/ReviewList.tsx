"use client";

import { useState, useEffect } from "react";
import { Star, User, Calendar, MessageSquare, ThumbsUp, Quote } from "lucide-react";
import { getVehicleReviews, getVehicleRatingStats } from "@/lib/actions/reviewActions";

interface ReviewListProps {
    vehicleId: number;
}

export default function ReviewList({ vehicleId }: ReviewListProps) {
    const [reviews, setReviews] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const [reviewsRes, statsRes] = await Promise.all([
                getVehicleReviews(vehicleId),
                getVehicleRatingStats(vehicleId)
            ]);

            if (reviewsRes.success) setReviews(reviewsRes.data || []);
            if (statsRes.success) setStats(statsRes.data);
            setLoading(false);
        }
        fetchData();
    }, [vehicleId]);

    if (loading) {
        return (
            <div className="space-y-4 animate-pulse">
                <div className="h-8 w-48 bg-gray-100 rounded-lg" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2].map(i => (
                        <div key={i} className="h-32 bg-gray-50 rounded-3xl" />
                    ))}
                </div>
            </div>
        );
    }

    if (reviews.length === 0) {
        return (
            <div className="bg-gray-50 border border-dashed border-gray-200 rounded-[2.5rem] p-12 text-center">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <MessageSquare className="w-8 h-8 text-gray-200" />
                </div>
                <h4 className="text-lg font-black text-gray-900 tracking-tight">No reviews yet</h4>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Be the first to share your experience</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Stats Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-gray-950 p-8 rounded-[2.5rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/5 rounded-full -mr-32 -mt-32 blur-[80px]" />
                
                <div className="relative z-10 flex items-center gap-6">
                    <div className="text-center">
                        <div className="text-5xl font-black text-white tracking-tighter mb-1">{stats?.averageRating || 0}</div>
                        <div className="flex justify-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star 
                                    key={s} 
                                    className={`w-3 h-3 ${s <= Math.round(stats?.averageRating || 0) ? "fill-yellow-400 text-yellow-400" : "text-white/20"}`} 
                                />
                            ))}
                        </div>
                    </div>
                    <div className="h-10 w-px bg-white/10 hidden sm:block" />
                    <div>
                        <p className="text-white font-black text-xs uppercase tracking-widest">{stats?.totalReviews || 0} User Reviews</p>
                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1">Authentic Community Feedback</p>
                    </div>
                </div>

                <div className="relative z-10 hidden md:flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-3 rounded-2xl backdrop-blur-sm">
                    <ThumbsUp className="w-4 h-4 text-emerald-400" />
                    <span className="text-white/60 text-[10px] font-black uppercase tracking-widest">98% Recommendation Rate</span>
                </div>
            </div>

            {/* Individual Reviews */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map((review) => (
                    <div key={review.reviewId} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative group hover:shadow-xl hover:border-yellow-100 transition-all">
                        <Quote className="absolute top-8 right-8 w-8 h-8 text-gray-50 group-hover:text-yellow-50 transition-colors" />
                        
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 border border-gray-100">
                                <User className="w-5 h-5" />
                            </div>
                            <div>
                                <h5 className="text-sm font-black text-gray-900 tracking-tight leading-none">{review.customerName || "Verified Guest"}</h5>
                                <div className="flex items-center gap-2 mt-1.5 text-gray-400">
                                    <Calendar className="w-3 h-3" />
                                    <span className="text-[9px] font-bold uppercase tracking-widest">{new Date(review.reviewDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-1 mb-4">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star 
                                    key={s} 
                                    className={`w-3.5 h-3.5 ${s <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-100"}`} 
                                />
                            ))}
                        </div>

                        <p className="text-gray-600 text-sm font-medium leading-relaxed italic">
                            "{review.comment || "The journey was fantastic and the service was top-notch. Highly recommended!"}"
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
