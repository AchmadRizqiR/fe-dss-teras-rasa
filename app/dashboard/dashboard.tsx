import React, { useState } from 'react';

// Type Definitions 
type LineDataPoint = {
  name: string;
  mie: number;
  jus: number;
};

type PieDataPoint = {
  name: string;
  value: number;
  color: string;
};

type IconProps = {
  size?: number;
};

type PadType = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

// Data Sintesis 
const lineData: LineDataPoint[] = [
  { name: 'Tgl 1', mie: 20, jus: 15 },
  { name: 'Tgl 5', mie: 35, jus: 20 },
  { name: 'Tgl 10', mie: 45, jus: 25 },
  { name: 'Tgl 15', mie: 40, jus: 30 },
  { name: 'Tgl 20', mie: 60, jus: 45 },
  { name: 'Tgl 25', mie: 75, jus: 55 },
  { name: 'Tgl 30', mie: 70, jus: 65 },
];

const pieData: PieDataPoint[] = [
  { name: 'Mie Ayam Bakso', value: 45, color: '#1e40af' },
  { name: 'Mie Ayam Pangsit', value: 25, color: '#3b82f6' },
  { name: 'Jus Alpukat', value: 15, color: '#93c5fd' },
  { name: 'Jus Jeruk', value: 15, color: '#dbeafe' },
];

// Inline SVG Icons (iseng ganti lucide-react dulu) 
const Icons = {
  LayoutDashboard: ({ size = 20 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  TrendingUp: ({ size = 20 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  FileUp: ({ size = 20 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="12" y1="18" x2="12" y2="12" />
      <polyline points="9 15 12 12 15 15" />
    </svg>
  ),
  DollarSign: ({ size = 20 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  ShoppingBag: ({ size = 20 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  ),
  Database: ({ size = 20 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  ),
  MoreVertical: ({ size = 20 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="1" fill="currentColor" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
      <circle cx="12" cy="19" r="1" fill="currentColor" />
    </svg>
  ),
};

// Line Chart (iseng ganti recharts LineChart dulu) 
const SimpleLineChart = ({ data }: { data: LineDataPoint[] }) => {
  const vbW: number = 500;
  const vbH: number = 220;
  const pad: PadType = { top: 10, right: 20, bottom: 30, left: 36 };
  const cW: number = vbW - pad.left - pad.right;
  const cH: number = vbH - pad.top - pad.bottom;
  const maxVal: number = 80;

  const getX = (i: number): number => pad.left + (i / (data.length - 1)) * cW;
  const getY = (val: number): number => pad.top + cH - (val / maxVal) * cH;

  const buildPath = (key: keyof LineDataPoint): string =>
    data
      .map((d: LineDataPoint, i: number) =>
        `${i === 0 ? 'M' : 'L'} ${getX(i).toFixed(1)} ${getY(d[key] as number).toFixed(1)}`
      )
      .join(' ');

  const yTicks: number[] = [0, 20, 40, 60, 80];

  return (
    <svg viewBox={`0 0 ${vbW} ${vbH}`} className="w-full" style={{ height: '280px' }}>
      {yTicks.map((tick: number) => (
        <g key={tick}>
          <line
            x1={pad.left} y1={getY(tick)}
            x2={vbW - pad.right} y2={getY(tick)}
            stroke="#f0f0f0" strokeWidth="1"
          />
          <text x={pad.left - 6} y={getY(tick) + 4} textAnchor="end" fontSize="11" fill="#9ca3af">
            {tick}
          </text>
        </g>
      ))}
      {data.map((d: LineDataPoint, i: number) => (
        <text key={i} x={getX(i)} y={vbH - 5} textAnchor="middle" fontSize="11" fill="#9ca3af">
          {d.name}
        </text>
      ))}
      <path d={buildPath('mie')} fill="none" stroke="#1e40af" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d={buildPath('jus')} fill="none" stroke="#93c5fd" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.7" />
    </svg>
  );
};

// Donut Chart (iseng ganti recharts PieChart dulu)
type DonutSegment = PieDataPoint & {
  dash: number;
  gap: number;
  rotation: number;
};

const DonutChart = ({ data }: { data: PieDataPoint[] }) => {
  const r: number = 68;
  const cx: number = 110;
  const cy: number = 110;
  const circumference: number = 2 * Math.PI * r;

  let cumulativePct: number = 0;
  const segments: DonutSegment[] = data.map((item: PieDataPoint): DonutSegment => {
    const dash: number = (item.value / 100) * circumference;
    const gap: number = circumference - dash;
    const rotation: number = (cumulativePct / 100) * 360 - 90;
    cumulativePct += item.value;
    return { ...item, dash, gap, rotation };
  });

  return (
    <svg viewBox="0 0 220 220" className="w-full" style={{ maxHeight: '200px' }}>
      {segments.map((seg: DonutSegment, i: number) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={seg.color}
          strokeWidth="26"
          strokeDasharray={`${seg.dash.toFixed(2)} ${seg.gap.toFixed(2)}`}
          transform={`rotate(${seg.rotation.toFixed(2)} ${cx} ${cy})`}
        />
      ))}
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize="15" fontWeight="bold" fill="#1e3a8a">
        Top 4
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" fontSize="11" fill="#9ca3af">
        Produk
      </text>
    </svg>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<string>('Dashboard');

  return (
    <div className="flex min-h-screen bg-[#f4f2fc]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700">
            <Icons.TrendingUp size={24} />
          </div>
          <div>
            <h1 className="font-bold text-blue-900 leading-tight">Mie Ayam & Juice</h1>
            <p className="text-xs text-gray-500 font-medium italic">Culinary SME Dashboard</p>
          </div>
        </div>

        <nav className="mt-6 px-4 flex-grow">
          <button
            onClick={() => setActiveTab('Dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeTab === 'Dashboard'
                ? 'bg-blue-100 text-blue-700 font-bold'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Icons.LayoutDashboard size={20} />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab('Prediksi')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'Prediksi'
                ? 'bg-blue-100 text-blue-700 font-bold'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Icons.TrendingUp size={20} />
            <span>Prediksi Penjualan</span>
          </button>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg font-bold hover:bg-blue-100 transition-colors">
            <span>+</span> Add New Order
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Ringkasan Dasbor</h2>
            <p className="text-gray-500">Pantau performa penjualan dan inventaris secara real-time.</p>
          </div>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="User Profile"
            />
          </div>
        </header>

        {/* Upload Area */}
        <section className="mb-8 p-12 border-2 border-dashed border-blue-200 bg-white/50 rounded-2xl flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
            <Icons.FileUp size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Unggah Laporan Penjualan Excel</h3>
          <p className="text-gray-500 max-w-md mx-auto mt-2">
            Tarik dan lepas file Excel Anda di sini, atau klik untuk memilih file dari komputer Anda untuk memperbarui data dasbor.
          </p>
          <div className="mt-4 px-4 py-1.5 bg-gray-200/50 text-xs text-gray-600 rounded-full">
            Mendukung .xlsx, .csv (Maks 10MB)
          </div>
        </section>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Icons.DollarSign size={20} />
              </div>
              <div className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded flex items-center gap-1">
                <Icons.TrendingUp size={12} /> +12%
              </div>
            </div>
            <p className="text-sm text-gray-500 font-medium">Pendapatan Harian</p>
            <h4 className="text-2xl font-bold text-gray-900 mt-1">Rp 4.250.000</h4>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Icons.ShoppingBag size={20} />
              </div>
              <div className="px-2 py-1 bg-red-50 text-red-600 text-xs font-bold rounded flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-red-600 rounded-full inline-block"></span> Sibuk
              </div>
            </div>
            <p className="text-sm text-gray-500 font-medium">Pesanan Aktif</p>
            <h4 className="text-2xl font-bold text-gray-900 mt-1">38 Pesanan</h4>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Icons.Database size={20} />
              </div>
              <div className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded">
                Real-time API
              </div>
            </div>
            <p className="text-sm text-gray-500 font-medium">Status Inventaris</p>
            <div className="flex items-center gap-3 mt-1 mb-2">
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '82%' }}></div>
              </div>
              <span className="text-xl font-bold text-gray-900">82%</span>
            </div>
            <p className="text-xs text-gray-400">Bahan utama aman.</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-gray-900">Performa Penjualan (30 Hari)</h3>
                <p className="text-xs text-gray-500">Mie Ayam vs Jus Buah</p>
              </div>
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <Icons.MoreVertical size={20} />
              </button>
            </div>
            <SimpleLineChart data={lineData} />
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-800 rounded-full"></div>
                <span className="text-xs text-gray-600 font-medium">Mie Ayam (Porsi)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-200 rounded-full"></div>
                <span className="text-xs text-gray-600 font-medium">Jus Buah (Gelas)</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="mb-6">
              <h3 className="font-bold text-gray-900">Distribusi Produk</h3>
              <p className="text-xs text-gray-500">Item terlaris minggu ini</p>
            </div>
            <DonutChart data={pieData} />
            <div className="mt-6 space-y-3">
              {pieData.map((item: PieDataPoint, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-xs text-gray-600 font-medium">{item.name}</span>
                  </div>
                  <span className="text-xs font-bold text-gray-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;