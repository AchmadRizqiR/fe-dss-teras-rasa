import React from 'react';
import {
  TrendingUp,
  Download,
  RefreshCw,
  ShoppingCart,
  Package,
} from 'lucide-react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement
);

// --- Chart Data ---

// Bar chart data (Target vs Realization)
const barData = {
  labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
  datasets: [
    {
      label: 'Target',
      data: [80, 90, 100, 110, 120, 140, 130],
      backgroundColor: '#1e40af', // blue-900
      borderRadius: 4,
      barPercentage: 0.5,
    },
    {
      label: 'Realisasi',
      data: [65, 70, 85, 95, 110, 135, 120],
      backgroundColor: '#e2e8f0', // gray-200
      borderRadius: 4,
      barPercentage: 0.5,
    },
  ],
};

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: 'white',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      titleColor: '#1e293b',
      bodyColor: '#1e293b',
      cornerRadius: 12,
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
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
          size: 12,
          weight: 'bold' as const, // ✅ Fix
        },
        color: '#94a3b8',
      },
    },
    y: {
      grid: { color: '#f1f5f9' },
      ticks: {
        font: { size: 12 },
        color: '#94a3b8',
      },
      beginAtZero: true,
    },
  },
};

// Donut chart data (radial target: 70% achieved)
const donutData = {
  datasets: [
    {
      data: [70, 30],
      backgroundColor: ['#1e40af', '#f1f5f9'],
      borderWidth: 0,
    },
  ],
};

const donutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '75%',
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
  },
};

// --- Mock Data for Restock Alerts & Projections ---

const restockAlerts = [
  {
    name: 'Tepung Mie Spesial',
    stock: '5kg',
    status: 'Habis dlm 2 hari',
    color: 'text-red-600',
    icon: <ShoppingCart className="text-white" size={18} />,
    bg: 'bg-red-50',
    iconBg: 'bg-red-600',
  },
  {
    name: 'Ayam Fillet (Paha)',
    stock: '12kg',
    status: 'Prediksi habis: 4 hari',
    color: 'text-gray-600',
    icon: <ShoppingCart className="text-white" size={18} />,
    bg: 'bg-blue-50',
    iconBg: 'bg-slate-600',
  },
  {
    name: 'Sirup Jeruk Nipis',
    stock: '8 botol',
    status: 'Prediksi habis: 6 hari',
    color: 'text-gray-600',
    icon: <ShoppingCart className="text-white" size={18} />,
    bg: 'bg-slate-50',
    iconBg: 'bg-slate-400',
  },
];

const dailyProjections = [
  {
    date: 'Senin, 20 Okt',
    traffic: 'Moderate (85-110 customer)',
    revenue: 'Rp 1.450.000',
    ops: 'Staff Standar (2 Org)',
    status: 'AMAN',
    statusColor: 'bg-green-100 text-green-700',
  },
  {
    date: 'Jumat, 24 Okt',
    traffic: 'High (180-220 customer)',
    revenue: 'Rp 2.800.000',
    ops: 'Extra Staff (4 Org)',
    status: 'PERLU PERSIAPAN',
    statusColor: 'bg-yellow-100 text-yellow-700',
  },
  {
    date: 'Sabtu, 25 Okt',
    traffic: 'Very High (250+ customer)',
    revenue: 'Rp 3.500.000',
    ops: 'Full Team + Stok Cadangan',
    status: 'PERLU PERSIAPAN',
    statusColor: 'bg-yellow-100 text-yellow-700',
  },
];

// --- Main Component ---

const SalesPrediction = () => {
  return (
    <div className="p-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Prediksi Sales & Restock</h2>
          <p className="text-gray-500">Optimalkan inventaris Anda berdasarkan tren mingguan.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-bold text-sm border border-blue-100">
            <Download size={18} /> Download Report
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-lg font-bold text-sm shadow-md">
            <RefreshCw size={18} /> Update Data
          </button>
        </div>
      </header>

      {/* Revenue Card + Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-20 -mt-20 opacity-50"></div>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider">
            Estimated Revenue
          </span>
          <h3 className="text-4xl font-bold text-gray-900 mt-4">Rp 12.450.000</h3>
          <p className="text-green-600 font-bold mt-2 flex items-center gap-1">
            <TrendingUp size={16} /> +12.5% <span className="text-gray-400 font-normal">dibanding minggu lalu</span>
          </p>

          <div className="grid grid-cols-3 gap-4 mt-10 pt-6 border-t border-gray-50">
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase">Prediksi Order</p>
              <p className="text-lg font-bold text-gray-900">
                840 <span className="text-sm font-normal text-gray-500">Porsi</span>
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase">Best Seller</p>
              <p className="text-lg font-bold text-gray-900">Mie Ayam Bakso</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase">Peak Day</p>
              <p className="text-lg font-bold text-gray-900">Sabtu, 19:00</p>
            </div>
          </div>
        </div>

        {/* Donut Chart (Target Achievement) */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
          <p className="text-sm font-bold text-gray-900 mb-6 w-full">Pencapaian Target Minggu Ini</p>
          <div className="relative w-48 h-48">
            <Doughnut data={donutData} options={donutOptions} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-gray-900">70%</span>
              <span className="text-xs text-gray-400 font-medium">Rp 8.715.000</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-6 text-center">
            Sisa <span className="font-bold text-gray-900">Rp 3.735.000</span> untuk mencapai target mingguan Anda.
          </p>
        </div>
      </div>

      {/* Bar Chart + Restock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-gray-900">Tren Target vs Realisasi</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-800 rounded-full"></div>
                <span className="text-xs text-gray-500">Target</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                <span className="text-xs text-gray-500">Realisasi</span>
              </div>
            </div>
          </div>
          <div className="h-64">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900">Restock Alerts</h3>
            <Package size={20} className="text-blue-800" />
          </div>
          <div className="space-y-4">
            {restockAlerts.map((item, idx) => (
              <div key={idx} className={`${item.bg} p-4 rounded-2xl flex items-center gap-4`}>
                <div className={`${item.iconBg} p-3 rounded-xl`}>{item.icon}</div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">
                    Stok: {item.stock} | <span className={item.color}>{item.status}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 border-2 border-dashed border-gray-200 text-xs font-bold text-gray-400 rounded-xl hover:bg-gray-50 transition-colors">
            Lihat Semua Rekomendasi Restock
          </button>
        </div>
      </div>

      {/* Projections Table */}
      <section className="mt-6 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-gray-900">Proyeksi Penjualan Harian</h3>
          <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full uppercase">
            Minggu, 20-26 Okt 2023
          </span>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Hari / Tanggal</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Prediksi Traffic</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Target Revenue</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Rekomendasi Operasional</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {dailyProjections.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50/30 transition-colors">
                <td className="px-6 py-5 text-sm font-bold text-gray-900">{row.date}</td>
                <td className="px-6 py-5 text-sm text-gray-600">{row.traffic}</td>
                <td className="px-6 py-5 text-sm font-bold text-gray-900">{row.revenue}</td>
                <td className="px-6 py-5 text-sm font-bold text-blue-800">{row.ops}</td>
                <td className="px-6 py-5">
                  <span className={`${row.statusColor} px-3 py-1 rounded-full text-[10px] font-bold`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default SalesPrediction;