"use client";

import { useState, useEffect } from "react";
import { Star, X, Save, Loader2, MessageSquare, AlertTriangle } from "lucide-react";
import { updateReviewAdmin } from "@/lib/actions/reviewActions";

interface EditReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    review: {
        reviewId: number;
        rating: number;
        comment: string | null;
        customerName: string | null;
    } | null;
    onSuccess: () => void;
}

export default function EditReviewModal({
    isOpen,
    onClose,
    review,
    onSuccess
}: EditReviewModalProps) {
    const [rating, setRating] = useState(review?.rating || 0);
    const [comment, setComment] = useState(review?.comment || "");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Update internal state when review changes
    useEffect(() => {
        if (review) {
            setRating(review.rating);
            setComment(review.comment || "");
        }
    }, [review]);

    if (!isOpen || !review) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const result = await updateReviewAdmin(review.reviewId, {
                rating,
                comment,
            });

            if (result.success) {
                onSuccess();
                onClose();
            } else {
                setError(result.error || "Failed to update review");
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-950/20 backdrop-blur-[2px] animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-[2rem] overflow-hidden shadow-premium animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="relative h-40 bg-gray-950 flex items-center justify-center overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/10 rounded-full -mr-32 -mt-32 blur-[80px]" />
                    <button 
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white/60 hover:bg-white/20 hover:text-white transition-all z-20"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    
                    <div className="relative z-10 text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">Moderator Access</span>
                        </div>
                        <h2 className="text-2xl font-black text-white tracking-tight">Modify Contribution</h2>
                        <p className="text-white/30 text-[9px] font-bold uppercase tracking-widest mt-1">Review ID: #{review.reviewId}</p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8">
                    <div className="mb-8 p-5 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-4">
                        <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                            <AlertTriangle className="w-5 h-5 text-yellow-500" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Editing Input By</p>
                            <p className="text-xs font-bold text-gray-900">{review.customerName}</p>
                        </div>
                    </div>

                    {/* Star Rating */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className="p-1 transition-transform active:scale-90"
                                    onClick={() => setRating(star)}
                                >
                                    <Star 
                                        className={`w-8 h-8 ${
                                            rating >= star 
                                                ? "fill-yellow-400 text-yellow-400" 
                                                : "text-gray-100"
                                        } transition-colors`} 
                                    />
                                </button>
                            ))}
                        </div>
                        <p className="mt-2 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                            New Rating: {rating} / 5
                        </p>
                    </div>

                    {/* Comment */}
                    <div className="space-y-3 mb-8">
                        <div className="flex items-center gap-2 px-1">
                            <MessageSquare className="w-4 h-4 text-gray-400" />
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Contribution Content</label>
                        </div>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full h-32 p-5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-900/5 focus:border-gray-900 transition-all resize-none"
                        />
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center">
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 h-12 rounded-xl border border-gray-200 text-gray-500 font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`flex-[2] h-12 rounded-xl flex items-center justify-center gap-2 transition-all font-black text-[10px] uppercase tracking-widest ${
                                isSubmitting
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-gray-950 text-white hover:bg-black"
                            }`}
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <Save className="w-3.5 h-3.5" />
                            )}
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
