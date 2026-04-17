"use client";

import { useState } from "react";
import { Star, X, Send, Loader2, MessageSquare, ShieldCheck } from "lucide-react";
import { submitReview } from "@/lib/actions/reviewActions";

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    bookingId: number;
    vehicleId: number;
    vehicleName: string;
    vehicleImage?: string | null;
    onSuccess: () => void;
}

export default function ReviewModal({
    isOpen,
    onClose,
    bookingId,
    vehicleId,
    vehicleName,
    vehicleImage,
    onSuccess
}: ReviewModalProps) {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            setError("Please select a rating");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const result = await submitReview({
                bookingId,
                vehicleId,
                rating,
                comment,
            });

            if (result.success) {
                onSuccess();
                onClose();
            } else {
                setError(result.error || "Failed to submit review");
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="relative h-48 bg-gray-950 flex items-center justify-center overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/10 rounded-full -mr-32 -mt-32 blur-[80px]" />
                    <button 
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white/60 hover:bg-white/20 hover:text-white transition-all z-20"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="relative z-10 text-center px-8">
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <ShieldCheck className="w-4 h-4 text-yellow-500" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Verified Rental</span>
                        </div>
                        <h2 className="text-2xl font-black text-white tracking-tight">How was your journey?</h2>
                        <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-1">{vehicleName}</p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-10">
                    {/* Star Rating */}
                    <div className="flex flex-col items-center mb-10">
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className="p-1 transition-transform active:scale-90 hover:scale-110"
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(0)}
                                    onClick={() => setRating(star)}
                                >
                                    <Star 
                                        className={`w-10 h-10 ${
                                            (hover || rating) >= star 
                                                ? "fill-yellow-400 text-yellow-400" 
                                                : "text-gray-200"
                                        } transition-colors`} 
                                    />
                                </button>
                            ))}
                        </div>
                        <p className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                            {rating === 0 ? "Select your rating" : `${rating} out of 5 stars`}
                        </p>
                    </div>

                    {/* Comment */}
                    <div className="space-y-4 mb-8">
                        <div className="flex items-center gap-2 px-2">
                            <MessageSquare className="w-4 h-4 text-gray-400" />
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Share your experience</label>
                        </div>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Write your review here... (optional)"
                            className="w-full h-32 p-6 bg-gray-50 border border-gray-100 rounded-3xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-yellow-400/20 focus:border-yellow-400 transition-all resize-none"
                        />
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center">
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting || rating === 0}
                        className={`w-full h-14 rounded-2xl flex items-center justify-center gap-3 transition-all font-black text-xs uppercase tracking-[0.2em] shadow-xl ${
                            isSubmitting || rating === 0
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-gray-950 text-white hover:bg-black active:scale-[0.98] shadow-gray-200"
                        }`}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4" />
                                Submit Review
                            </>
                        )}
                    </button>
                    
                    <p className="mt-6 text-center text-[9px] font-medium text-gray-400 leading-relaxed px-4">
                        Your review will be public and helps other members choose the best vehicles and drivers for their journey.
                    </p>
                </form>
            </div>
        </div>
    );
}
