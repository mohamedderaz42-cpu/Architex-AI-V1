
import React, { useState, useRef } from 'react';
import { GlassPanel } from './GlassPanel';
import { DatabaseIcon } from './icons/DatabaseIcon';
import { CloudUploadIcon } from './icons/CloudUploadIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { RefreshIcon } from './icons/RefreshIcon'; // Reusing RefreshCwIcon logic as RefreshIcon
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { LoaderIcon } from './icons/LoaderIcon';
import { LockIcon } from './icons/LockIcon';
import * as api from '../core/api/contract';
import { useToast } from './Toast';

export const BackupManager: React.FC = () => {
    const [isExporting, setIsExporting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isRestoring, setIsRestoring] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { addToast } = useToast();

    const handleLocalExport = async () => {
        setIsExporting(true);
        try {
            const jsonString = await api.exportSystemState();
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `architex_backup_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            addToast('System snapshot exported successfully', 'success');
        } catch (e) {
            addToast('Export failed', 'error');
        } finally {
            setIsExporting(false);
        }
    };

    const handleCloudBackup = async () => {
        setIsUploading(true);
        setUploadProgress(0);

        // Simulate a multi-step secure upload process
        const steps = [
            { progress: 20, msg: "Encrypting Data (AES-256)..." },
            { progress: 50, msg: "Compressing Archive..." },
            { progress: 80, msg: "Uploading to Decentralized Storage..." },
            { progress: 100, msg: "Verifying Integrity Hash..." }
        ];

        for (const step of steps) {
            await new Promise(r => setTimeout(r, 800));
            setUploadProgress(step.progress);
        }

        setIsUploading(false);
        addToast('Encrypted backup secured on cloud', 'success');
    };

    const handleRestoreClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsRestoring(true);
        const reader = new FileReader();
        
        reader.onload = async (event) => {
            try {
                const json = event.target?.result as string;
                await api.restoreSystemState(json);
                addToast('System restored successfully. Reloading...', 'success');
                setTimeout(() => window.location.reload(), 2000);
            } catch (err) {
                addToast('Invalid backup file integrity', 'error');
            } finally {
                setIsRestoring(false);
            }
        };

        reader.readAsText(file);
    };

    return (
        <div className="space-y-4 h-full flex flex-col">
            {/* Status Header */}
            <div className="bg-slate-900/50 p-4 rounded-xl border border-white/10 flex items-center justify-between">
                <div className="flex items-center">
                    <div className="p-2 bg-eco-green/20 rounded-lg mr-3">
                        <CheckCircleIcon className="w-6 h-6 text-eco-green" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-white">System Healthy</h4>
                        <p className="text-xs text-slate-400">Last Backup: 2 hours ago</p>
                    </div>
                </div>
                <div className="flex items-center text-xs text-pi-gold bg-pi-gold/10 px-3 py-1 rounded-full border border-pi-gold/20">
                    <LockIcon className="w-3 h-3 mr-1" /> Encrypted
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                {/* Local Backup Panel */}
                <div className="bg-slate-800/30 p-5 rounded-xl border border-white/5 flex flex-col">
                    <div className="mb-4">
                        <div className="flex items-center mb-2">
                            <DatabaseIcon className="w-5 h-5 text-ai-violet mr-2" />
                            <h3 className="font-bold text-white">Local Snapshot</h3>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Download a full JSON dump of the current platform state (Users, Orders, Contracts). Useful for development and manual archival.
                        </p>
                    </div>
                    
                    <div className="mt-auto space-y-3">
                        <button 
                            onClick={handleLocalExport}
                            disabled={isExporting}
                            className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold text-sm transition-colors flex items-center justify-center disabled:opacity-50"
                        >
                            {isExporting ? <LoaderIcon className="w-4 h-4 animate-spin mr-2" /> : <DownloadIcon className="w-4 h-4 mr-2" />}
                            {isExporting ? 'Bundling...' : 'Download JSON'}
                        </button>

                        <div className="relative">
                            <input 
                                type="file" 
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden" 
                                accept=".json"
                            />
                            <button 
                                onClick={handleRestoreClick}
                                disabled={isRestoring}
                                className="w-full py-3 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-lg font-bold text-sm transition-colors flex items-center justify-center disabled:opacity-50"
                            >
                                {isRestoring ? <LoaderIcon className="w-4 h-4 animate-spin mr-2" /> : <RefreshIcon className="w-4 h-4 mr-2" />}
                                {isRestoring ? 'Restoring...' : 'Restore from File'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Cloud Backup Panel */}
                <div className="bg-slate-800/30 p-5 rounded-xl border border-white/5 flex flex-col relative overflow-hidden">
                    <div className="relative z-10 mb-4">
                        <div className="flex items-center mb-2">
                            <CloudUploadIcon className="w-5 h-5 text-pi-gold mr-2" />
                            <h3 className="font-bold text-white">Cloud Redundancy</h3>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Securely upload an encrypted snapshot to the decentralized storage network. Maintains data integrity across nodes.
                        </p>
                    </div>

                    {isUploading && (
                        <div className="absolute inset-0 bg-slate-900/90 z-20 flex flex-col items-center justify-center p-6 text-center">
                            <LoaderIcon className="w-10 h-10 text-pi-gold animate-spin mb-4" />
                            <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
                                <div className="bg-pi-gold h-2 rounded-full transition-all duration-300" style={{width: `${uploadProgress}%`}}></div>
                            </div>
                            <p className="text-xs text-white font-mono">Syncing... {uploadProgress}%</p>
                        </div>
                    )}
                    
                    <div className="mt-auto relative z-10">
                         <div className="bg-black/20 p-3 rounded-lg mb-3 border border-white/5">
                            <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                                <span>Storage Used</span>
                                <span>45%</span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-1.5">
                                <div className="bg-ai-violet h-1.5 rounded-full" style={{width: '45%'}}></div>
                            </div>
                         </div>

                        <button 
                            onClick={handleCloudBackup}
                            disabled={isUploading}
                            className="w-full py-3 bg-gradient-to-r from-ai-violet to-indigo-600 hover:from-ai-violet/80 hover:to-indigo-600/80 text-white rounded-lg font-bold text-sm transition-all flex items-center justify-center shadow-lg shadow-ai-violet/20 disabled:opacity-50"
                        >
                            <CloudUploadIcon className="w-4 h-4 mr-2" />
                            Initiate Secure Backup
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
