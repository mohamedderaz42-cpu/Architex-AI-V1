
import React from 'react';
import { ProductEntity } from '../core/schemas/entities';
import { PiCoinIcon } from './icons/PiCoinIcon';
import { TrendingUpIcon } from './icons/TrendingUpIcon';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';

interface VendorDashboardProps {
    products: ProductEntity[];
}

export const VendorDashboard: React.FC<VendorDashboardProps> = ({ products }) => {
    // Mock Data calculation
    const totalStock = products.reduce((acc, p) => acc + p.inStock, 0);
    const lowStockItems = products.filter(p => p.inStock < 50);
    const totalRevenue = 12540.50; // Mocked revenue
    const monthlyGrowth = 12.5;

    return (
        <div className="p-4 space-y-4 animate-fade-in">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-4 rounded-2xl border border-white/5 shadow-lg">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-eco-green/20 rounded-lg">
                            <PiCoinIcon className="w-5 h-5 text-eco-green" />
                        </div>
                        <span className="text-[10px] text-eco-green bg-eco-green/10 px-2 py-0.5 rounded-full flex items-center">
                            <TrendingUpIcon className="w-3 h-3 mr-1" /> {monthlyGrowth}%
                        </span>
                    </div>
                    <div className="text-2xl font-bold text-white">{totalRevenue.toLocaleString()}</div>
                    <div className="text-xs text-slate-400">Total Revenue (PiUSD)</div>
                </div>

                <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-4 rounded-2xl border border-white/5 shadow-lg">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-ai-violet/20 rounded-lg">
                            <ShoppingCartIcon className="w-5 h-5 text-ai-violet" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-white">142</div>
                    <div className="text-xs text-slate-400">Orders This Month</div>
                </div>
            </div>

            {/* Alerts Section */}
            {lowStockItems.length > 0 && (
                <div className="bg-orange-900/20 border border-orange-500/30 p-4 rounded-xl">
                    <div className="flex items-center mb-3">
                        <AlertTriangleIcon className="w-5 h-5 text-orange-400 mr-2" />
                        <h4 className="font-bold text-white text-sm">Inventory Alerts</h4>
                    </div>
                    <div className="space-y-2">
                        {lowStockItems.map(p => (
                            <div key={p.id} className="flex justify-between items-center text-xs bg-black/20 p-2 rounded">
                                <span className="text-slate-300">{p.name}</span>
                                <span className="text-orange-400 font-bold">{p.inStock} units left</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Sales Chart Mockup */}
            <div className="bg-slate-900/50 p-4 rounded-xl border border-white/10">
                <h4 className="text-sm font-bold text-white mb-4">Weekly Sales Performance</h4>
                <div className="flex items-end justify-between h-32 space-x-2">
                    {[35, 50, 45, 70, 60, 85, 65].map((h, i) => (
                        <div key={i} className="flex flex-col items-center flex-1">
                            <div 
                                className="w-full bg-ai-violet/50 rounded-t hover:bg-ai-violet transition-all relative group"
                                style={{height: `${h}%`}}
                            >
                                <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 text-[9px] text-white bg-black px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    {h * 10}
                                </div>
                            </div>
                            <span className="text-[9px] text-slate-500 mt-1">{['M','T','W','T','F','S','S'][i]}</span>
                        </div>
                    ))}
                </div>
            </div>

             <div className="bg-slate-900/50 p-4 rounded-xl border border-white/10">
                <h4 className="text-sm font-bold text-white mb-2">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-2">
                    <button className="p-3 bg-slate-800 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-700 transition-colors">Download Sales Report</button>
                    <button className="p-3 bg-slate-800 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-700 transition-colors">Update Business Profile</button>
                </div>
            </div>
        </div>
    );
};
