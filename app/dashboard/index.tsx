import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  ChevronDown, 
  Settings,
} from 'lucide-react';
import Dashboard from './dashboard';
import Predict from './predict';
import TrainModel from './trainModel';

export default function DashboardIndex() {
    const [activeTab, setActiveTab] = useState<string>('Dashboard');

    return (
    <div className="flex min-h-screen bg-[#f4f2fc]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-10">
        <div className="p-6">
          <h1 className="text-xl font-bold text-blue-900">Mie Ayam & Juice</h1>
          <p className="text-xs text-gray-500">Admin Panel</p>
        </div>

        <nav className="mt-4 px-4 space-y-1 flex-1">
          <div onClick={() => setActiveTab('Dashboard')} className={`w-full flex items-center cursor-pointer gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeTab === 'Dashboard'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}>
            <LayoutDashboard size={20} />
            <span className="font-medium text-sm">Dashboard</span>
          </div>
          
          <div>
            <div className="flex items-center justify-between px-4 py-3 bg-blue-50/50 text-blue-900 rounded-lg cursor-pointer">
              <div className="flex items-center gap-3">
                <TrendingUp size={20} />
                <span className="font-bold text-sm">Prediksi Penjualan</span>
              </div>
              <ChevronDown size={16} />
            </div>
            <div className="ml-11 mt-2 space-y-2 font-medium text-sm">
              <div onClick={() => setActiveTab('Predict')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 cursor-pointer transition-colors ${
                activeTab === 'Predict'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}>Prediksi Sales & Restock</div>
              <div onClick={() => setActiveTab('Train')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 cursor-pointer transition-colors ${
                activeTab === 'Train'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}>Retrain Model</div>
            </div>
          </div>
        </nav>

        <div className="p-6 border-t border-gray-100 flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700">
            <Settings size={20} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 leading-none">Chef Admin</p>
            <p className="text-[10px] text-gray-400 uppercase mt-1">System Engineer</p>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
      {activeTab === 'Dashboard' && <Dashboard />}

      {activeTab === 'Train' && <TrainModel />}

      {activeTab === 'Predict' && <Predict />}
      
      </main>
    </div>
  );
};