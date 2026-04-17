"use client";

import { useState, useEffect } from "react";
import { 
    MessageSquare, 
    Star, 
    Edit2, 
    Trash2, 
    Car, 
    User, 
    Calendar, 
    Loader2, 
    Search,
    ChevronDown,
    ChevronUp,
    ShieldCheck,
    Quote
} from "lucide-react";
import { getAllReviewsForAdmin, deleteReviewAdmin } from "@/lib/actions/reviewActions";
import EditReviewModal from "@/components/admin/EditReviewModal";

interface Review {
    reviewId: number;
    rating: number;
    comment: string | null;
    reviewDate: any;
    customerName: string | null;
}

interface ReviewGroup {
    vehicleInfo: {
        vehicleId: number;
        plateNumber: string;
        brand: string | null;
        model: string | null;
    };
    reviews: Review[];
}

export default function AdminReviewsPage() {
    const [groupedReviews, setGroupedReviews] = useState<ReviewGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [expandedVehicles, setExpandedVehicles] = useState<Record<string, boolean>>({});

    const fetchReviews = async () => {
        setLoading(true);
        const result = await getAllReviewsForAdmin();
        if (result.success && result.data) {
            const data = result.data as ReviewGroup[];
            setGroupedReviews(data);
            // Expand the first vehicle by default
            if (data[0]) {
                setExpandedVehicles({ [data[0].vehicleInfo.plateNumber]: true });
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const toggleVehicle = (plate: string) => {
        setExpandedVehicles(prev => ({
            ...prev,
            [plate]: !prev[plate]
        }));
    };

    const handleDelete = async (reviewId: number) => {
        if (!confirm("Are you sure you want to delete this review? This action cannot be undone.")) return;
        
        const result = await deleteReviewAdmin(reviewId);
        if (result.success) {
            fetchReviews();
        } else {
            alert(result.error || "Failed to delete review");
        }
    };

    const handleEdit = (review: Review) => {
        setSelectedReview(review);
        setIsEditModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-[#fcfcfc] pb-24">
            {/* Header */}
            <header className="bg-gray-950 text-white px-8 py-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-400/5 rounded-full -mr-64 -mt-64 blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full -ml-48 -mb-48 blur-[100px]" />
                <div className="container mx-auto relative z-10 px-4">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-px w-8 bg-yellow-400/50" />
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-yellow-400/80">Control Center</span>
                    </div>
                    <h1 className="text-6xl font-black tracking-tighter mb-4 leading-none">Review <span className="text-yellow-400">Moderation</span></h1>
                    <p className="text-white/40 font-bold uppercase tracking-[0.2em] text-[10px] max-w-md leading-relaxed">
                        Curate and manage community feedback to maintain the highest standards of our premium mobility fleet.
                    </p>
                </div>
            </header>

            <main className="container mx-auto px-6 -mt-12 relative z-20">
                {loading ? (
                    <div className="bg-white rounded-[3rem] border border-gray-100 shadow-premium p-24 text-center">
                        <Loader2 className="w-12 h-12 text-gray-900 animate-spin mx-auto mb-6" />
                        <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Retrieving Global Feedback...</p>
                    </div>
                ) : groupedReviews.length === 0 ? (
                    <div className="bg-white rounded-[3rem] border border-gray-100 shadow-premium p-24 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
                            <MessageSquare className="w-10 h-10 text-gray-200" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-2">Neutral Sentiment</h3>
                        <p className="text-gray-400 font-medium">No customer reviews have been submitted yet.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {groupedReviews.map((group) => {
                            const plate = group.vehicleInfo.plateNumber;
                            const isExpanded = expandedVehicles[plate];
                            const avgRating = (group.reviews.reduce((sum: number, r: Review) => sum + r.rating, 0) / group.reviews.length).toFixed(1);

                            return (
                                <div key={plate} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-premium">
                                    {/* Vehicle Header */}
                                    <button 
                                        onClick={() => toggleVehicle(plate)}
                                        className="w-full px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 text-left hover:bg-gray-50/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-gray-200">
                                                <Car className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-black text-gray-900 tracking-tight leading-none">
                                                    {plate} <span className="text-gray-300 mx-2">|</span> 
                                                    <span className="text-gray-500 font-bold">{group.vehicleInfo.brand} {group.vehicleInfo.model}</span>
                                                </h4>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <div className="flex items-center gap-1.5 text-[10px] font-black text-yellow-500 uppercase tracking-widest">
                                                        <Star className="w-3 h-3 fill-yellow-500" />
                                                        {avgRating} Average
                                                    </div>
                                                    <div className="w-1 h-1 bg-gray-200 rounded-full" />
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{group.reviews.length} Contributions</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 ml-auto">
                                            {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-300" /> : <ChevronDown className="w-5 h-5 text-gray-300" />}
                                        </div>
                                    </button>

                                    {/* Reviews List */}
                                    {isExpanded && (
                                        <div className="border-t border-gray-50 bg-gray-50/20 p-8 space-y-4">
                                            {group.reviews.map((review: any) => (
                                                <div key={review.reviewId} className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col md:flex-row items-start gap-6 group">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-3 mb-3">
                                                            <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 border border-gray-100">
                                                                <User className="w-4 h-4" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h5 className="text-xs font-black text-gray-900 tracking-tight">{review.customerName}</h5>
                                                                <div className="flex items-center gap-2 mt-0.5 text-gray-400">
                                                                    <Calendar className="w-3 h-3" />
                                                                    <span className="text-[9px] font-bold uppercase tracking-widest">{new Date(review.reviewDate).toLocaleDateString()}</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-0.5">
                                                                {[1, 2, 3, 4, 5].map((s) => (
                                                                    <Star 
                                                                        key={s} 
                                                                        className={`w-3 h-3 ${s <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-100"}`} 
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="relative">
                                                            <Quote className="absolute -top-1 -left-1 w-4 h-4 text-gray-50 -z-10" />
                                                            <p className="text-[11px] font-medium text-gray-600 leading-relaxed italic pl-4">
                                                                {review.comment || "No comment provided."}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 self-end md:self-center">
                                                        <button 
                                                            onClick={() => handleEdit(review)}
                                                            className="w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center hover:bg-black transition-all shadow-sm active:scale-90"
                                                            title="Edit Review"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(review.reviewId)}
                                                            className="w-10 h-10 rounded-xl bg-white border border-gray-100 text-red-500 flex items-center justify-center hover:bg-red-50 transition-all shadow-sm active:scale-90"
                                                            title="Delete Review"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* Edit Modal */}
            <EditReviewModal 
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                review={selectedReview}
                onSuccess={fetchReviews}
            />
        </div>
    );
}
