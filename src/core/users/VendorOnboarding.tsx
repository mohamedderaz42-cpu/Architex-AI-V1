
import React, { useState } from 'react';
import { GlassPanel } from '../../components/GlassPanel';
import { PackageIcon } from '../../components/icons/PackageIcon';
import { DocumentIcon } from '../../components/icons/DocumentIcon';
import { CheckCircleIcon } from '../../components/icons/CheckCircleIcon';
import { UploadCloudIcon } from '../../components/icons/UploadCloudIcon';
import { VendorProfile } from '../schemas/entities';
import { MockAdapter } from '../api/contract';

interface VendorOnboardingProps {
    onComplete: (profile: VendorProfile) => void;
    onCancel: () => void;
}

export const VendorOnboarding: React.FC<VendorOnboardingProps> = ({ onComplete, onCancel }) => {
    const [step, setStep] = useState(1);
    const [companyName, setCompanyName] = useState('');
    const [taxId, setTaxId] = useState('');
    const [licenseFile, setLicenseFile] = useState<string | null>(null);
    const [insuranceFile, setInsuranceFile] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (type: 'license' | 'insurance') => (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const fileName = e.target.files[0].name;
            if (type === 'license') setLicenseFile(fileName);
            else setInsuranceFile(fileName);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const profile: VendorProfile = {
            companyName,
            taxId,
            hasInsurance: !!insuranceFile,
            agreedToIndemnity: true,
            verificationDate: new Date().toISOString(),
            status: 'pending',
            licenseUrl: 'mock_license_url',
            insuranceUrl: 'mock_insurance_url'
        };

        try {
            await MockAdapter.identity.registerAsVendor(profile);
            onComplete(profile);
        } catch (e) {
            console.error(e);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-brand-dark/90 backdrop-blur-md flex items-center justify-center z-[90] p-4">
            <GlassPanel className="w-full max-w-md p-6 animate-fade-in">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 mx-auto bg-ai-violet/20 rounded-full flex items-center justify-center mb-3 shadow-glow-violet">
                        <PackageIcon className="w-8 h-8 text-ai-violet" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Vendor Registration</h2>
                    <p className="text-sm text-slate-400">Join the decentralized supply chain.</p>
                </div>

                <div className="space-y-4">
                    {step === 1 && (
                        <div className="animate-fade-in space-y-4">
                            <div>
                                <label className="block text-xs text-slate-400 mb-1 ml-1">Company Name</label>
                                <input 
                                    type="text" 
                                    value={companyName} 
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-ai-violet"
                                    placeholder="Acme Supplies Inc."
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1 ml-1">Tax ID / VAT Number</label>
                                <input 
                                    type="text" 
                                    value={taxId} 
                                    onChange={(e) => setTaxId(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-ai-violet"
                                    placeholder="XX-XXXXXXX"
                                />
                            </div>
                            <button 
                                onClick={() => setStep(2)}
                                disabled={!companyName || !taxId}
                                className="w-full py-3 bg-ai-violet text-white font-bold rounded-lg hover:bg-ai-violet/80 transition-all disabled:opacity-50 mt-4"
                            >
                                Next: Verification
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-fade-in space-y-4">
                            <div className="p-4 border border-dashed border-slate-600 rounded-xl bg-slate-900/30 hover:border-ai-violet transition-colors group relative">
                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleFileChange('license')} accept=".pdf,.jpg" />
                                <div className="flex flex-col items-center justify-center">
                                    {licenseFile ? (
                                        <>
                                            <CheckCircleIcon className="w-8 h-8 text-eco-green mb-2" />
                                            <span className="text-sm text-white font-medium">{licenseFile}</span>
                                        </>
                                    ) : (
                                        <>
                                            <DocumentIcon className="w-8 h-8 text-slate-500 mb-2 group-hover:text-ai-violet transition-colors" />
                                            <span className="text-sm text-slate-300">Upload Business License</span>
                                            <span className="text-[10px] text-slate-500">PDF or JPG (Max 5MB)</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="p-4 border border-dashed border-slate-600 rounded-xl bg-slate-900/30 hover:border-ai-violet transition-colors group relative">
                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleFileChange('insurance')} accept=".pdf,.jpg" />
                                <div className="flex flex-col items-center justify-center">
                                    {insuranceFile ? (
                                        <>
                                            <CheckCircleIcon className="w-8 h-8 text-eco-green mb-2" />
                                            <span className="text-sm text-white font-medium">{insuranceFile}</span>
                                        </>
                                    ) : (
                                        <>
                                            <UploadCloudIcon className="w-8 h-8 text-slate-500 mb-2 group-hover:text-ai-violet transition-colors" />
                                            <span className="text-sm text-slate-300">Upload Liability Insurance</span>
                                            <span className="text-[10px] text-slate-500">Mandatory for Sellers</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="flex space-x-3 pt-2">
                                <button onClick={() => setStep(1)} className="flex-1 py-3 text-slate-400 hover:text-white">Back</button>
                                <button 
                                    onClick={handleSubmit}
                                    disabled={isSubmitting || !licenseFile || !insuranceFile}
                                    className="flex-[2] py-3 bg-eco-green text-white font-bold rounded-lg hover:bg-eco-green/80 transition-all disabled:opacity-50 shadow-glow-green"
                                >
                                    {isSubmitting ? 'Verifying...' : 'Submit Application'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </GlassPanel>
        </div>
    );
};
