import React, { useState } from 'react';
import { GlassPanel } from './GlassPanel';
import { StarIcon } from './icons/StarIcon';

interface RatingModalProps {
    onConfirm: (rating: number, comment: string) => void;
    onCancel: () => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({ onConfirm, onCancel }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) return;
        setIsSubmitting(true);
        await onConfirm(rating, comment);
        setIsSubmitting(false);
        onCancel();
    };

    return (
        <div className="fixed inset-0 bg-brand-dark/80 backdrop-blur-md flex items-center justify-center z-[80] p-4">
            <GlassPanel className="w-full max-w-sm p-6 animate-fade-in">
                <div className="text-center">
                    <StarIcon className="w-12 h-12 mx-auto text-pi-gold mb-2" />
                    <h2 className="text-2xl font-bold text-white">Rate Your Designer</h2>
                    <p className="text-slate-400 mt-1 text-sm">Your feedback helps build a trusted community.</p>
                </div>

                <div className="flex justify-center my-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                            key={star}
                            className={`w-10 h-10 cursor-pointer transition-colors ${
                                (hoverRating || rating) >= star ? 'text-pi-gold' : 'text-slate-600'
                            }`}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                        />
                    ))}
                </div>

                <textarea
                    placeholder="Add an optional comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-ai-violet/50 h-20 resize-none"
                ></textarea>
                
                <div className="mt-6 flex flex-col space-y-3">
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || rating === 0}
                        className="w-full px-6 py-3 bg-pi-gold/80 border border-pi-gold/90 rounded-full text-lg font-semibold text-white hover:bg-pi-gold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Rating'}
                    </button>
                    <button
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className="w-full py-2 text-slate-400 font-semibold hover:text-white transition-colors disabled:opacity-50"
                    >
                        Skip
                    </button>
                </div>
            </GlassPanel>
        </div>
    );
};