
import React, { useState, useEffect } from 'react';
import { GlassPanel } from './GlassPanel';
import { UsersIcon } from './icons/UsersIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { LayoutIcon } from './icons/LayoutIcon';
import { LayersIcon } from './icons/LayersIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { PlusIcon } from './icons/PlusIcon';
import { LoaderIcon } from './icons/LoaderIcon';
import { TeamMemberEntity, DesignTemplateEntity, SpendingMetric, ProductEntity } from '../core/schemas/entities';
import * as api from '../core/api/contract';
import { useToast } from './Toast';
import { ArchitexLogo } from './icons/ArchitexLogo';
import { PiCoinIcon } from './icons/PiCoinIcon';

interface EnterprisePortalProps {
    onClose: () => void;
}

type Tab = 'dashboard' | 'team' | 'templates' | 'bulk';

export const EnterprisePortal: React.FC<EnterprisePortalProps> = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState<Tab>('dashboard');
    const [team, setTeam] = useState<TeamMemberEntity[]>([]);
    const [templates, setTemplates] = useState<DesignTemplateEntity[]>([]);
    const [metrics, setMetrics] = useState<SpendingMetric[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { addToast } = useToast();

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            const [teamData, tmplData, metricsData] = await Promise.all([
                api.listTeamMembers('org_01'),
                api.listDesignTemplates(),
                api.getEnterpriseAnalytics()
            ]);
            setTeam(teamData);
            setTemplates(tmplData);
            setMetrics(metricsData);
            setIsLoading(false);
        };
        loadData();
    }, []);

    // --- Sub-Components ---

    const RenderDashboard = () => {
        const totalSpend = metrics.reduce((acc, m) => acc + m.amount, 0);
        
        return (
            <div className="animate-fade-in space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                        <h4 className="text-xs text-slate-400 uppercase tracking-wide mb-1">Monthly Spend</h4>
                        <div className="text-2xl font-bold text-white flex items-center">
                            <PiCoinIcon className="w-5 h-5 text-pi-gold mr-2" />
                            {totalSpend.toLocaleString()}
                        </div>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                        <h4 className="text-xs text-slate-400 uppercase tracking-wide mb-1">Active Projects</h4>
                        <div className="text-2xl font-bold text-white">12</div>
                    </div>
                </div>

                <div className="bg-slate-900/50 p-4 rounded-xl border border-white/10">
                    <h4 className="text-sm font-bold text-white mb-4">Expenditure Trends</h4>
                    <div className="h-32 flex items-end justify-between space-x-2 px-2">
                        {metrics.map((m, idx) => (
                            <div key={idx} className="flex flex-col items-center flex-1">
                                <div 
                                    className="w-full bg-ai-violet/60 rounded-t hover:bg-ai-violet/80 transition-all relative group"
                                    style={{ height: `${(m.amount / 25000) * 100}%` }}
                                >
                                    <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-black text-white text-[9px] px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        {m.amount/1000}k
                                    </div>
                                </div>
                                <span className="text-[9px] text-slate-500 mt-1">{m.month}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const RenderTeam = () => {
        const handleInvite = async () => {
            await api.inviteTeamMember('new@user.com', 'Designer');
            const updated = await api.listTeamMembers('org_01');
            setTeam(updated);
            addToast('Invite sent', 'success');
        };

        return (
            <div className="animate-fade-in flex flex-col h-full">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-white">Team Members</h3>
                    <button onClick={handleInvite} className="bg-ai-violet hover:bg-ai-violet/80 text-white p-1.5 rounded-lg transition-colors">
                        <PlusIcon className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex-grow overflow-y-auto space-y-3 pr-1">
                    {team.map(member => (
                        <div key={member.id} className="flex items-center justify-between bg-slate-900/50 p-3 rounded-xl border border-white/5">
                            <div className="flex items-center">
                                <img src={member.avatarUrl} alt={member.name} className="w-10 h-10 rounded-full mr-3 border border-slate-700" />
                                <div>
                                    <div className="font-bold text-sm text-white">{member.name}</div>
                                    <div className="text-xs text-slate-400 flex items-center">
                                        {member.role} 
                                        {member.role === 'Admin' && <ShieldCheckIcon className="w-3 h-3 text-pi-gold ml-1" />}
                                    </div>
                                </div>
                            </div>
                            <div className="text-[10px] text-slate-500">
                                {member.lastActive === 'Never' ? 'Invited' : 'Active'}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const RenderTemplates = () => (
        <div className="animate-fade-in grid grid-cols-2 gap-3 overflow-y-auto pr-1">
             <div 
                className="border-2 border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center h-32 cursor-pointer hover:border-ai-violet hover:bg-slate-800/30 transition-all"
                onClick={() => addToast('Template Creator Launching...', 'info')}
            >
                <PlusIcon className="w-8 h-8 text-slate-500 mb-2" />
                <span className="text-xs font-bold text-slate-400">New Template</span>
            </div>
            {templates.map(t => (
                <div key={t.id} className="bg-slate-900/50 rounded-xl border border-white/10 overflow-hidden group relative">
                    <img src={t.thumbnailUrl} className="w-full h-20 object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                    <div className="p-2">
                        <h5 className="font-bold text-xs text-white truncate">{t.name}</h5>
                        <p className="text-[10px] text-slate-400">{t.itemCount} Items • {t.style}</p>
                    </div>
                </div>
            ))}
        </div>
    );

    const RenderBulkOrder = () => {
        const [input, setInput] = useState('');
        const [quote, setQuote] = useState<{total: number, commission: number, discount: number} | null>(null);
        const [isCalculating, setIsCalculating] = useState(false);

        const handleCalculate = async () => {
            setIsCalculating(true);
            // Mock parsing input: "prod_01:50, prod_02:20"
            const lines = input.split('\n');
            const pids: string[] = [];
            const qtys: number[] = [];
            
            // Simulation of parsing
            pids.push('prod_01'); qtys.push(100); 
            
            const result = await api.processBulkOrder(pids, qtys);
            setQuote(result);
            setIsCalculating(false);
        };

        return (
            <div className="animate-fade-in flex flex-col h-full">
                <p className="text-xs text-slate-400 mb-2">Enter Product IDs and Quantities (CSV format)</p>
                <textarea 
                    className="w-full h-24 bg-slate-900/80 border border-white/10 rounded-xl p-3 text-xs font-mono text-white mb-4 focus:border-eco-green outline-none"
                    placeholder="prod_01, 50&#10;prod_02, 120..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                />
                
                {quote && (
                    <div className="bg-slate-800/50 p-3 rounded-xl border border-eco-green/30 mb-4 space-y-1 text-sm">
                        <div className="flex justify-between text-slate-300">
                            <span>Volume Discount</span>
                            <span className="text-eco-green">-{quote.discount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                            <span>B2B Commission (Simulated)</span>
                            <span className="text-pi-gold">{quote.commission.toFixed(2)}</span>
                        </div>
                         <div className="flex justify-between font-bold text-white border-t border-white/10 pt-1 mt-1">
                            <span>Total</span>
                            <span>{quote.total.toFixed(2)} PiUSD</span>
                        </div>
                    </div>
                )}

                <button 
                    onClick={handleCalculate}
                    disabled={isCalculating}
                    className="w-full py-3 bg-eco-green hover:bg-green-600 text-white font-bold rounded-full transition-colors disabled:opacity-50"
                >
                    {isCalculating ? <LoaderIcon className="w-5 h-5 animate-spin mx-auto" /> : 'Get B2B Quote'}
                </button>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-brand-dark/95 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
            <GlassPanel className="w-full max-w-4xl h-[80vh] flex overflow-hidden relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white z-10">&times;</button>
                
                {/* Sidebar */}
                <div className="w-20 bg-slate-900/50 border-r border-white/5 flex flex-col items-center py-6 space-y-6">
                    <div className="p-2 bg-white/5 rounded-lg mb-4">
                        <ArchitexLogo className="w-8 h-8 text-white" />
                    </div>
                    
                    <button onClick={() => setActiveTab('dashboard')} className={`p-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-ai-violet text-white shadow-glow-violet' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                        <ChartBarIcon className="w-6 h-6" />
                    </button>
                    <button onClick={() => setActiveTab('team')} className={`p-3 rounded-xl transition-all ${activeTab === 'team' ? 'bg-ai-violet text-white shadow-glow-violet' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                        <UsersIcon className="w-6 h-6" />
                    </button>
                    <button onClick={() => setActiveTab('templates')} className={`p-3 rounded-xl transition-all ${activeTab === 'templates' ? 'bg-ai-violet text-white shadow-glow-violet' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                        <LayoutIcon className="w-6 h-6" />
                    </button>
                    <button onClick={() => setActiveTab('bulk')} className={`p-3 rounded-xl transition-all ${activeTab === 'bulk' ? 'bg-ai-violet text-white shadow-glow-violet' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                        <LayersIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Main Content */}
                <div className="flex-grow flex flex-col p-6 bg-brand-dark/50">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-white flex items-center">
                            {activeTab === 'dashboard' && 'Enterprise Dashboard'}
                            {activeTab === 'team' && 'Team Management'}
                            {activeTab === 'templates' && 'Design Templates'}
                            {activeTab === 'bulk' && 'Bulk Procurement'}
                            <span className="ml-3 px-2 py-0.5 bg-pi-gold/20 text-pi-gold text-[10px] uppercase font-bold rounded border border-pi-gold/30">
                                PRO
                            </span>
                        </h2>
                        <p className="text-sm text-slate-400">
                            Archie Design Corp • ID: org_01
                        </p>
                    </div>

                    <div className="flex-grow overflow-hidden relative">
                        {isLoading ? (
                             <div className="absolute inset-0 flex items-center justify-center">
                                <LoaderIcon className="w-10 h-10 text-ai-violet animate-spin" />
                            </div>
                        ) : (
                            <>
                                {activeTab === 'dashboard' && <RenderDashboard />}
                                {activeTab === 'team' && <RenderTeam />}
                                {activeTab === 'templates' && <RenderTemplates />}
                                {activeTab === 'bulk' && <RenderBulkOrder />}
                            </>
                        )}
                    </div>
                </div>
            </GlassPanel>
        </div>
    );
};
