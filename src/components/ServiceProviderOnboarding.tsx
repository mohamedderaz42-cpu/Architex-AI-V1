
import React, { useState } from 'react';
import { GlassPanel } from './GlassPanel';
import { WrenchIcon } from './icons/WrenchIcon';
import { DocumentIcon } from './icons/DocumentIcon';
import { ServiceProviderProfile } from '../core/schemas/entities';

interface ServiceProviderOnboardingProps {
    onRegister: (profile: ServiceProviderProfile) => Promise<void>;
    onClose: () => void;
}

export const ServiceProviderOnboarding: React.FC<ServiceProviderOnboardingProps> = ({ onRegister, onClose }) => {
    const [specialty, setSpecialty] = useState('');
    const [portfolioUrl, setPortfolioUrl] = useState('');
    const [serviceZone, setServiceZone] = useState('');
    const [hasInsurance, setHasInsurance] = useState(false);
    const [insuranceFile, setInsuranceFile] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setInsuranceFile(e.target.files[0].name);
            setHasInsurance(true);
        }
    };

    const handleSubmit = async () => {
        if (!specialty || !serviceZone || !hasInsurance) return;
        setIsSubmitting(true);
        try {
            await onRegister({
                specialty,
                portfolioUrl,
                serviceZones: [serviceZone],
                hasLiabilityInsurance: hasInsurance,
                verificationStatus: 'pending',
                insuranceDocUrl: 'mock_url_to_s3'
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
                    <WrenchIcon className="w-12 h-12 mx-auto text-eco-green mb-2" />
                    <h2 className="text-2xl font-bold text-white">Join as a Pro</h2>
                    <p className="text-sm text-slate-400">Verify your credentials to offer services on Architex.</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs text-slate-400 mb-1">Specialty</label>
                        <select value={specialty} onChange={e => setSpecialty(e.target.value)} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-eco-green">
                            <option value="">Select Specialty...</option>
                            <option value="General Construction">General Construction</option>
                            <option value="Electrical & Automation">Electrical & Automation</option>
                            <option value="Plumbing">Plumbing</option>
                            <option value="Interior Design">Interior Design</option>
                            <option value="HVAC">HVAC</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs text-slate-400 mb-1">Service Zone (Region)</label>
                        <input type="text" value={serviceZone} onChange={e => setServiceZone(e.target.value)} placeholder="e.g. USA-CA, UK-LDN" className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-eco-green" />
                    </div>

                    <div>
                        <label className="block text-xs text-slate-400 mb-1">Portfolio URL</label>
                        <input type="url" value={portfolioUrl} onChange={e => setPortfolioUrl(e.target.value)} placeholder="https://..." className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-eco-green" />
                    </div>

                    <div className="pt-2">
                        <label className="block text-xs text-slate-400 mb-2">General Liability Insurance Upload</label>
                        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:border-eco-green transition-colors bg-slate-800/30">
                            <DocumentIcon className="w-8 h-8 text-slate-500 mb-1" />
                            <span className="text-xs text-slate-400">{insuranceFile || "Click to upload PDF"}</span>
                            <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.jpg,.png" />
                        </label>
                    </div>
                </div>

                <div className="mt-6 flex space-x-3">
                    <button onClick={onClose} className="flex-1 py-2 text-slate-400 hover:text-white transition-colors">Cancel</button>
                    <button onClick={handleSubmit} disabled={isSubmitting || !specialty || !hasInsurance} className="flex-1 py-2 bg-eco-green text-white font-bold rounded-lg hover:bg-eco-green/80 transition-colors disabled:opacity-50">
                        {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </button>
                </div>
            </GlassPanel>
        </div>
    );
};
