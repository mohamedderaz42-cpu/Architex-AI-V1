
import React, { useState, useEffect } from 'react';
import { GlassPanel } from './GlassPanel';
import { ScanIcon } from './icons/ScanIcon';
import { DesignIcon } from './icons/DesignIcon';
import { MarketIcon } from './icons/MarketIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

interface OnboardingTourProps {
    onComplete: () => void;
}

const slides = [
    {
        icon: ScanIcon,
        title: "Scan Your Space",
        description: "Use our AI-powered SLAM scanner to create a digital twin of your room in seconds.",
        color: "text-pi-gold"
    },
    {
        icon: DesignIcon,
        title: "Visualize Styles",
        description: "Transform your space with generative AI. Switch between Modern, Industrial, and more.",
        color: "text-ai-violet"
    },
    {
        icon: MarketIcon,
        title: "Trade & Hire",
        description: "Buy eco-friendly materials and hire certified professionals using Pi currency.",
        color: "text-eco-green"
    }
];

export const OnboardingTour: React.FC<OnboardingTourProps> = ({ onComplete }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleNext = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(curr => curr + 1);
        } else {
            handleComplete();
        }
    };

    const handleComplete = () => {
        setIsVisible(false);
        setTimeout(onComplete, 500); // Allow fade out animation
    };

    const CurrentIcon = slides[currentSlide].icon;

    return (
        <div className={`fixed inset-0 z-[100] bg-brand-dark flex items-center justify-center p-6 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-ai-violet/20 via-brand-dark to-brand-dark"></div>
            
            <div className="relative w-full max-w-sm text-center">
                {/* Image/Icon Area */}
                <div className="h-64 flex items-center justify-center mb-8 relative">
                    <div className={`absolute inset-0 bg-gradient-to-b from-transparent to-brand-dark/90 z-10`}></div>
                    <div className={`w-40 h-40 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-xl shadow-[0_0_50px_-12px_rgba(255,255,255,0.1)] animate-float`}>
                        <CurrentIcon className={`w-20 h-20 ${slides[currentSlide].color}`} />
                    </div>
                </div>

                {/* Text Content */}
                <div className="space-y-4 mb-12 min-h-[120px]">
                    <h2 className="text-3xl font-bold text-white transition-all duration-300">{slides[currentSlide].title}</h2>
                    <p className="text-slate-400 leading-relaxed transition-all duration-300">
                        {slides[currentSlide].description}
                    </p>
                </div>

                {/* Indicators */}
                <div className="flex justify-center space-x-2 mb-8">
                    {slides.map((_, idx) => (
                        <div 
                            key={idx} 
                            className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/20'}`}
                        />
                    ))}
                </div>

                {/* Actions */}
                <button 
                    onClick={handleNext}
                    className="group w-full flex items-center justify-center px-6 py-4 bg-white text-brand-dark rounded-full font-bold text-lg hover:bg-slate-200 transition-all duration-300"
                >
                    {currentSlide === slides.length - 1 ? "Get Started" : "Next"}
                    <ChevronRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button onClick={handleComplete} className="mt-4 text-sm text-slate-500 font-semibold hover:text-white transition-colors">
                    Skip Intro
                </button>
            </div>
        </div>
    );
};
