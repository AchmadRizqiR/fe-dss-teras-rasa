import React, { useState } from 'react';
import {
  TrendingUp,
  RefreshCw,
  ChevronDown,
  FileText,
  Database,
  Search,
  Bell,
  Settings,
  MoreVertical,
  Play,
  Upload,
  CheckCircle2,
  AlertTriangle,
  History,
  Terminal,
  Trash2
} from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const performanceData = {
  labels: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
  datasets: [
    {
      label: 'Predicted',
      data: [45, 75, 55, 95, 65, 85, 70],
      backgroundColor: '#1e3a8a',
      borderRadius: 4,
      barPercentage: 0.5,
    },
    {
      label: 'Actual',
      data: [42, 80, 50, 90, 68, 82, 72],
      backgroundColor: '#94a3b8',
      borderRadius: 4,
      barPercentage: 0.5,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top' as const,
      labels: {
        boxWidth: 12,
        padding: 20,
        font: {
          size: 10,
          weight: 'bold' as const,
        },
        color: '#94a3b8',
      },
    },
    tooltip: {
      callbacks: {
        label: (context: any) => `${context.dataset.label}: ${context.parsed.y}`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        font: {
          size: 10,
          weight: 'bold' as const,
        },
        color: '#94a3b8',
      },
    },
    y: {
      grid: { color: '#f1f5f9' },
      ticks: {
        font: { size: 10 },
        color: '#94a3b8',
      },
      beginAtZero: true,
    },
  },
};

const logs = [
  { type: 'SYSTEM', text: 'Initialization backend-prediction-engine-v2...', color: 'text-green-400' },
  { type: 'INFO', text: 'Connection to PostgreSQL established (2ms)', color: 'text-gray-300' },
  { type: 'INFO', text: 'Fetching raw training data: 12,402 rows found', color: 'text-gray-300' },
  { type: 'INFO', text: 'Data Cleaning: Handling missing values in "inventory_stock"', color: 'text-gray-300' },
  { type: 'PROCESS', text: 'Feature Engineering: Appending "public_holiday" indicators', color: 'text-blue-400' },
  { type: 'SUCCESS', text: 'Pre-processing complete. Model ready for hyperparameter tuning.', color: 'text-green-500 font-bold' },
  { type: 'TRAIN', text: 'Epoch 1/10 - loss: 0.245 - accuracy: 0.81', color: 'text-gray-400' },
  { type: 'TRAIN', text: 'Epoch 2/10 - loss: 0.182 - accuracy: 0.85', color: 'text-gray-400' },
  { type: 'TRAIN', text: 'Epoch 3/10 - loss: 0.141 - accuracy: 0.89', color: 'text-gray-400' },
];

const TrainModel = () => {
  const [activeTab, setActiveTab] = useState('ingestion');

  return (
    <div className="p-8">
      {/* Breadcrumb & title */}
      <div className="mb-6">
        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">
          Prediksi Penjualan &gt; Retrain Model
        </p>
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-black text-blue-900 tracking-tight">Retrain ML Model</h2>
            <p className="text-gray-500 mt-2 max-w-xl">
              Manajemen data training dan optimalisasi algoritma prediksi penjualan harian.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all">
              <RefreshCw size={18} /> Refresh Status
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-blue-800 text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 hover:bg-blue-900 transition-all">
              <Play size={18} fill="currentColor" /> Start Retraining
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left column - stats */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Model Status</p>
              <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full uppercase">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> Active
              </span>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-400">Model Version</p>
                <p className="text-lg font-mono font-bold text-blue-900">v2.4.0-stable</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Last Trained</p>
                <p className="text-sm font-bold text-gray-900">12 Oct 2023, 04:20</p>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-xs text-gray-400">Confidence Level</p>
                  <p className="text-xs font-bold text-blue-900">94.2%</p>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 w-[94.2%]"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-1 rounded-2xl border-l-4 border-l-amber-500 border border-gray-100 shadow-sm">
            <div className="p-5">
              <div className="flex gap-4 items-start">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                  <AlertTriangle size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">Data Drift Detected</p>
                  <p className="text-xs text-gray-500 mt-1">Detected slight deviation in 'Juice' category</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <button className="py-2 bg-amber-900 text-white text-xs font-bold rounded-lg">Auto-Fix</button>
                <button className="py-2 border border-gray-200 text-xs font-bold text-gray-600 rounded-lg">Details</button>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Quick Metrics</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50/50 p-4 rounded-xl text-center">
                <p className="text-[10px] text-blue-400 font-bold uppercase">MAE</p>
                <p className="text-xl font-bold text-blue-900">4.12</p>
              </div>
              <div className="bg-blue-50/50 p-4 rounded-xl text-center">
                <p className="text-[10px] text-blue-400 font-bold uppercase">RMSE</p>
                <p className="text-xl font-bold text-blue-900">5.89</p>
              </div>
              <div className="bg-blue-50/50 p-4 rounded-xl text-center">
                <p className="text-[10px] text-blue-400 font-bold uppercase">R-Squared</p>
                <p className="text-xl font-bold text-blue-900">0.92</p>
              </div>
              <div className="bg-blue-50/50 p-4 rounded-xl text-center">
                <p className="text-[10px] text-blue-400 font-bold uppercase">Training Time</p>
                <p className="text-xl font-bold text-blue-900">4m 2s</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="col-span-12 lg:col-span-9 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex border-b border-gray-50">
              <button
                onClick={() => setActiveTab('ingestion')}
                className={`flex items-center gap-2 px-8 py-4 text-sm font-bold transition-all border-b-2 ${
                  activeTab === 'ingestion'
                    ? 'border-blue-800 text-blue-800 bg-blue-50/30'
                    : 'border-transparent text-gray-400'
                }`}
              >
                <Database size={18} /> Data Ingestion
              </button>
              <button
                onClick={() => setActiveTab('logs')}
                className={`flex items-center gap-2 px-8 py-4 text-sm font-bold transition-all border-b-2 ${
                  activeTab === 'logs'
                    ? 'border-blue-800 text-blue-800 bg-blue-50/30'
                    : 'border-transparent text-gray-400'
                }`}
              >
                <History size={18} /> Data Logs
              </button>
            </div>

            <div className="p-8">
              {activeTab === 'ingestion' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="p-10 border-2 border-dashed border-blue-100 rounded-3xl bg-blue-50/20 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 bg-white text-blue-800 rounded-2xl shadow-sm flex items-center justify-center mb-4">
                      <Upload size={24} />
                    </div>
                    <h4 className="font-bold text-gray-900">Tarik & Lepas Data Penjualan</h4>
                    <p className="text-xs text-gray-500 mt-2 max-w-xs">
                      Format yang didukung: .csv, .xlsx. Pastikan kolom tanggal, menu_id, dan qty tersedia untuk hasil yang akurat.
                    </p>
                    <button className="mt-6 px-8 py-2 bg-blue-800 text-white rounded-full text-sm font-bold">Pilih File</button>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 border border-gray-100 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gray-50 text-blue-800 rounded-xl">
                          <Database size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 uppercase">External Source: POS API</p>
                          <p className="text-[10px] text-gray-400">Last sync: 2 hours ago</p>
                        </div>
                      </div>
                      <CheckCircle2 className="text-green-500" size={20} />
                    </div>
                    <div className="p-4 border border-gray-100 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gray-50 text-blue-800 rounded-xl">
                          <FileText size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 uppercase">Archive: Oct_Sales.zip</p>
                          <p className="text-[10px] text-gray-400">Ready to process</p>
                        </div>
                      </div>
                      <Trash2 className="text-gray-300 hover:text-red-500 cursor-pointer" size={20} />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'logs' && (
                <div className="text-center py-12 text-gray-400">
                  <History size={48} className="mx-auto mb-4 opacity-30" />
                  <p className="font-bold text-gray-600">Data Logs coming soon</p>
                  <p className="text-sm">History of ingestion and processing will appear here.</p>
                </div>
              )}
            </div>
          </div>

          {/* Performance Chart */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-bold text-gray-900">Performance Evaluation</h3>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-800 rounded-full"></div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Predicted</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Actual</span>
                </div>
              </div>
            </div>
            <div className="h-64">
              <Bar data={performanceData} options={chartOptions} />
            </div>
          </div>

          {/* Terminal Logs */}
          <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl">
            <div className="bg-slate-800 px-6 py-3 flex justify-between items-center border-b border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="ml-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Terminal size={14} /> Real-time Backend Logs
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <ChevronDown size={18} />
              </div>
            </div>
            <div className="p-6 font-mono text-xs space-y-1.5 h-64 overflow-y-auto">
              {logs.map((log, idx) => (
                <div key={idx} className="flex gap-4">
                  <span className="text-gray-600 min-w-17.5">[{log.type}]</span>
                  <span className={log.color}>{log.text}</span>
                </div>
              ))}
              <div className="flex gap-2 items-center">
                <span className="w-2 h-4 bg-gray-400 animate-pulse"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainModel;