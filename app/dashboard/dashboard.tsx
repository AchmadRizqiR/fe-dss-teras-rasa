import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import { User } from "lucide-react";

import { Pie, Line } from "react-chartjs-2";
import DataService from "../services/DataService";
import type { OmzetTrendData, KpiData } from "../services/DataService";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
);

// Type Definitions
type IconProps = {
  size?: number;
};

type PieChartData = {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
    borderWidth?: number;
  }[];
};

// Inline SVG Icons
const Icons = {
  LayoutDashboard: ({ size = 20 }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  TrendingUp: ({ size = 20 }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  FileUp: ({ size = 20 }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="12" y1="18" x2="12" y2="12" />
      <polyline points="9 15 12 12 15 15" />
    </svg>
  ),
  DollarSign: ({ size = 20 }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  ShoppingBag: ({ size = 20 }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  ),
  Database: ({ size = 20 }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  ),
  MoreVertical: ({ size = 20 }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="5" r="1" fill="currentColor" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
      <circle cx="12" cy="19" r="1" fill="currentColor" />
    </svg>
  ),
  CheckCircle2: ({ size = 20 }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  AlertCircle: ({ size = 20 }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
};

// Main Dashboard Component
const Dashboard = () => {
  const [pieData, setPieData] = useState<PieChartData | null>(null);
  const [omzetTrend, setOmzetTrend] = useState<OmzetTrendData | null>(null);
  const [kpiData, setKpiData] = useState<KpiData | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<string | null>(null);
  const [uploadErr, setUploadErr] = useState<string | null>(null);
  const [uploadStatusHariIni, setUploadStatusHariIni] = useState<any>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const loadDashboardData = () => {
    DataService.fetchPieData().then((data) => setPieData(data));
    DataService.fetchOmzetTrend().then((data) => setOmzetTrend(data));
    DataService.fetchKPI().then((data) => setKpiData(data));
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleUpload = async () => {
    if (!file) {
      setUploadErr("Pilih file Excel terlebih dahulu.");
      return;
    }
    setUploading(true);
    setUploadErr(null);
    setUploadMsg(null);
    setUploadStatusHariIni(null);
    try {
      const res = await DataService.uploadHarian(file);
      setUploadMsg(res.message);
      setUploadStatusHariIni(res.status_hari_ini);
      loadDashboardData(); // refresh KPI & chart setelah upload sukses
    } catch (err: any) {
      setUploadErr(err?.message || "Gagal mengunggah file.");
    } finally {
      setUploading(false);
    }
  };

  // Transform omzetTrend into Chart.js Line format
  const lineChartData = omzetTrend
    ? {
        labels: omzetTrend.labels,
        datasets: [
          {
            label: "Omzet (Rp)",
            data: omzetTrend.data,
            borderColor: "#1e40af",
            backgroundColor: "rgba(30, 64, 175, 0.08)",
            borderWidth: 2.5,
            pointRadius: 4,
            pointBackgroundColor: "#1e40af",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            tension: 0.4,
            fill: true,
          },
        ],
      }
    : null;

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) =>
            ` Rp ${context.parsed.y.toLocaleString("id-ID")}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          font: { size: 11 },
          color: "#9ca3af",
          // Shorten date labels: "2026-05-01" → "01/05"
          callback: (_: any, index: number) => {
            if (!omzetTrend) return "";
            const parts = omzetTrend.labels[index].split("-");
            return `${parts[2]}/${parts[1]}`;
          },
        },
      },
      y: {
        grid: { color: "#f3f4f6" },
        ticks: {
          font: { size: 11 },
          color: "#9ca3af",
          callback: (value: any) => `${(value / 1000).toFixed(0)}k`,
        },
      },
    },
  };

  return (
    <div>
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Ringkasan Dasbor</h2>
          <p className="text-gray-500">
            Pantau performa penjualan dan inventaris secara real-time.
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 border-2 border-white shadow-sm flex items-center justify-center">
          <User size={20} />
        </div>
      </header>

      {/* Upload Area */}
      <section
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const dropped = e.dataTransfer.files?.[0];
          if (dropped) {
            setFile(dropped);
            setUploadMsg(null);
            setUploadErr(null);
          }
        }}
        className={`mb-8 p-12 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center transition-colors ${
          dragging
            ? "border-blue-500 bg-blue-50"
            : "border-blue-200 bg-white/50"
        }`}
      >
        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
          <Icons.FileUp size={24} />
        </div>
        <h3 className="text-lg font-bold text-gray-900">
          Unggah Laporan Penjualan Excel
        </h3>
        <p className="text-gray-500 max-w-md mx-auto mt-2">
          Tarik dan lepas file Excel Anda di sini, atau klik untuk memilih file
          dari komputer Anda untuk memperbarui data dasbor.
        </p>
        <div className="mt-4 px-4 py-1.5 bg-gray-200/50 text-xs text-gray-600 rounded-full">
          Mendukung .xlsx, .xls (Maks 10MB)
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={(e) => {
            setFile(e.target.files?.[0] || null);
            setUploadMsg(null);
            setUploadErr(null);
          }}
        />

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-2 border border-blue-200 text-blue-700 rounded-full text-sm font-bold hover:bg-blue-50 transition-colors cursor-pointer"
          >
            {file ? file.name : "Pilih File"}
          </button>
          <button
            onClick={handleUpload}
            disabled={uploading || !file}
            className="px-6 py-2 bg-blue-800 text-white rounded-full text-sm font-bold shadow-md disabled:opacity-50 cursor-pointer"
          >
            {uploading ? "Mengunggah..." : "Unggah"}
          </button>
        </div>

        {uploadMsg && (
          <div className="mt-4 flex items-center gap-2 text-green-700 text-xs font-medium">
            <Icons.CheckCircle2 size={16} /> {uploadMsg}
          </div>
        )}
        {uploadErr && (
          <div className="mt-4 flex items-center gap-2 text-red-600 text-xs font-medium">
            <Icons.AlertCircle size={16} /> {uploadErr}
          </div>
        )}
        {uploadStatusHariIni != null && (
          <div className="mt-3 text-xs text-gray-600 bg-gray-50 rounded-xl px-4 py-2">
            Status hari ini: {JSON.stringify(uploadStatusHariIni)}
          </div>
        )}
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
          <p className="text-sm text-gray-500 font-medium">
            Pendapatan Hari ini
          </p>
          <h4 className="text-2xl font-bold text-gray-900 mt-1">
            {omzetTrend?.data && omzetTrend.data.length > 0
              ? `Rp ${omzetTrend.data[omzetTrend.data.length - 1].toLocaleString("id-ID")}`
              : "Loading..."}
          </h4>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Icons.ShoppingBag size={20} />
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium">Mie Ayam Terjual</p>
          <h4 className="text-2xl font-bold text-gray-900 mt-1">
            {kpiData?.total_penjualan_mie_ayam != null
              ? `${kpiData.total_penjualan_mie_ayam} Porsi`
              : "Loading..."}
          </h4>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Icons.Database size={20} />
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium">Status Jus</p>
          {kpiData !== null ? (
            <div className="text-2xl font-bold text-gray-900 mt-1">
              <div>Jus Terlaris: {kpiData.jus_terlaris}</div>
              <div>Jus Tersepi: {kpiData.jus_tersepi}</div>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart — Omzet Trend */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-gray-900">Tren Omzet</h3>
              <p className="text-xs text-gray-500">Pendapatan harian (Rp)</p>
            </div>
            <button className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
              <Icons.MoreVertical size={20} />
            </button>
          </div>
          {lineChartData ? (
            <Line data={lineChartData} options={lineChartOptions as any} />
          ) : (
            <p className="text-center text-gray-400 py-8">Loading...</p>
          )}
        </div>

        {/* Pie Chart — Distribusi Produk */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="mb-6">
            <h3 className="font-bold text-gray-900">Distribusi Produk</h3>
            <p className="text-xs text-gray-500">Item terlaris minggu ini</p>
          </div>
          {pieData ? (
            <Pie data={pieData} />
          ) : (
            <p className="text-center text-gray-400 py-8">Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
