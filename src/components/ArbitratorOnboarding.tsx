
import React, { useState } from 'react';
import { GlassPanel } from './GlassPanel';
import { GavelIcon } from './icons/GavelIcon';
import { DocumentIcon } from './icons/DocumentIcon';
import { ArbitratorProfile } from '../core/schemas/entities';

interface ArbitratorOnboardingProps {
    onRegister: (profile: ArbitratorProfile) => Promise<void>;
    onClose: () => void;
}

export const ArbitratorOnboarding: React.FC<ArbitratorOnboardingProps> = ({ onRegister, onClose }) => {
    const [specialty, setSpecialty] = useState('');
    const [years, setYears] = useState('');
    const [fee, setFee] = useState('');
    const [cvFile, setCvFile] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setCvFile(e.target.files[0].name);
        }
    };

    const handleSubmit = async () => {
        if (!specialty || !fee || !cvFile) return;
        setIsSubmitting(true);
        try {
            await onRegister({
                specialty,
                yearsExperience: parseInt(years) || 0,
                fee: parseFloat(fee) || 0,
                cvUrl: 'mock_cv_url',
                verificationStatus: 'pending',
                casesResolved: 0,
                resolutionRate: 100
            });
            onClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-brand-dark/80 backdrop-blur-md flex items-center justify-center z-[90] p-4">
            <GlassPanel className="w-full max-w-md p-6 animate-fade-in">
                <div className="text-center mb-6">
                    <GavelIcon className="w-12 h-12 mx-auto text-pi-gold mb-2" />
                    <h2 className="text-2xl font-bold text-white">Become an Arbitrator</h2>
                    <p className="text-sm text-slate-400">Help resolve disputes and earn PiUSD.</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs text-slate-400 mb-1">Area of Expertise</label>
                        <select value={specialty} onChange={e => setSpecialty(e.target.value)} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-pi-gold/50">
                            <option value="">Select Area...</option>
                            <option value="Residential Design">Residential Design</option>
                            <option value="Commercial & NFT">Commercial & NFT</option>
                            <option value="Engineering Disputes">Engineering Disputes</option>
                            <option value="Contract Law">Contract Law</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Years Experience</label>
                            <input type="number" value={years} onChange={e => setYears(e.target.value)} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-pi-gold/50" />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Base Fee (PiUSD)</label>
                            <input type="number" value={fee} onChange={e => setFee(e.target.value)} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-pi-gold/50" />
                        </div>
                    </div>

                    <div className="pt-2">
                        <label className="block text-xs text-slate-400 mb-2">Upload CV / Proof of Expertise</label>
                        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:border-pi-gold/50 transition-colors bg-slate-800/30">
                            <DocumentIcon className="w-8 h-8 text-slate-500 mb-1" />
                            <span className="text-xs text-slate-400">{cvFile || "Upload PDF"}</span>
                            <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf" />
                        </label>
                    </div>
                </div>

                <div className="mt-6 flex space-x-3">
                    <button onClick={onClose} className="flex-1 py-2 text-slate-400 hover:text-white transition-colors">Cancel</button>
                    <button onClick={handleSubmit} disabled={isSubmitting || !specialty || !cvFile} className="flex-1 py-2 bg-pi-gold text-brand-dark font-bold rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50">
                        {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </button>
                </div>
            </GlassPanel>
        </div>
    );
};
