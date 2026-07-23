import React, { useState, useEffect, useCallback } from "react";
import {
  TrendingUp,
  Download,
  RefreshCw,
  ShoppingCart,
  Package,
  AlertCircle,
} from "lucide-react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import DataService from "../services/DataService";

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement);

// Harga menu mengikuti backend (upload.py → HARGA_MENU)
const HARGA_MENU: Record<string, number> = {
  "Mie Ayam": 15000,
  Alpukat: 12000,
  Mangga: 12000,
  Strobery: 12000,
  Jeruk: 10000,
  Jambu: 10000,
};

// Estimasi kebutuhan bahan per porsi (untuk restock alert)
const KEBUTUHAN_BAHAN: Record<string, { bahan: string; perPorsi: number; satuan: string }> = {
  "Mie Ayam": { bahan: "Mie Kering", perPorsi: 0.1, satuan: "kg" },
  Alpukat: { bahan: "Alpukat", perPorsi: 0.25, satuan: "kg" },
  Mangga: { bahan: "Mangga", perPorsi: 0.25, satuan: "kg" },
  Strobery: { bahan: "Stroberi", perPorsi: 0.2, satuan: "kg" },
  Jeruk: { bahan: "Jeruk", perPorsi: 0.2, satuan: "kg" },
  Jambu: { bahan: "Jambu", perPorsi: 0.2, satuan: "kg" },
};

const formatRupiah = (n: number) =>
  `Rp ${Math.round(n).toLocaleString("id-ID")}`;

type RestockItem = {
  name: string;
  estimasi: string;
  status: string;
  color: string;
  bg: string;
  iconBg: string;
};

const SalesPrediction = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [estimasiOmzet, setEstimasiOmzet] = useState<number>(0);
  const [tanggalPrediksi, setTanggalPrediksi] = useState<string>("");

  const loadPrediction = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await DataService.fetchPredictOmzet();
      setEstimasiOmzet(data.estimasi_omzet || 0);
      setTanggalPrediksi(data.tanggal_prediksi || "");
    } catch (err: any) {
      setError(err?.message || "Gagal memuat prediksi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPrediction();
  }, [loadPrediction]);

  // --- Estimasi porsi per menu (distribusi proporsional berdasarkan harga) ---
  const totalHarga = Object.values(HARGA_MENU).reduce((a, b) => a + b, 0);
  const estimasiPorsi = Object.entries(HARGA_MENU).map(([menu, harga]) => ({
    menu,
    porsi: Math.round((estimasiOmzet * (harga / totalHarga)) / harga),
  }));

  const totalPorsi = estimasiPorsi.reduce((a, b) => a + b.porsi, 0);

  // Restock alert dari estimasi porsi
  const restockAlerts: RestockItem[] = estimasiPorsi
    .map(({ menu, porsi }) => {
      const keb = KEBUTUHAN_BAHAN[menu];
      if (!keb) return null;
      const total = (porsi * keb.perPorsi).toFixed(1);
      return {
        name: keb.bahan,
        estimasi: `${total} ${keb.satuan}`,
        status: `Untuk ${porsi} porsi ${menu}`,
        color: "text-gray-600",
        bg: "bg-blue-50",
        iconBg: "bg-slate-600",
      } as RestockItem;
    })
    .filter((x): x is RestockItem => x !== null);

  // Donut: proporsi estimasi porsi mie ayam vs jus
  const porsiMie = estimasiPorsi.find((p) => p.menu === "Mie Ayam")?.porsi || 0;
  const porsiJus = totalPorsi - porsiMie;
  const donutData = {
    datasets: [
      {
        data: [porsiMie, porsiJus],
        backgroundColor: ["#1e40af", "#93c5fd"],
        borderWidth: 0,
      },
    ],
  };
  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "75%",
    plugins: { legend: { display: false }, tooltip: { enabled: true } },
  };

  // Bar chart: estimasi porsi per menu (Target vs Estimasi)
  const barData = {
    labels: estimasiPorsi.map((p) => p.menu),
    datasets: [
      {
        label: "Estimasi Porsi",
        data: estimasiPorsi.map((p) => p.porsi),
        backgroundColor: "#1e40af",
        borderRadius: 4,
        barPercentage: 0.5,
      },
    ],
  };
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "white",
        borderColor: "#e2e8f0",
        borderWidth: 1,
        titleColor: "#1e293b",
        bodyColor: "#1e293b",
        callbacks: {
          label: (context: any) => `${context.dataset.label}: ${context.parsed.y} porsi`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 11, weight: "bold" as const }, color: "#94a3b8" },
      },
      y: {
        grid: { color: "#f1f5f9" },
        ticks: { font: { size: 12 }, color: "#94a3b8" },
        beginAtZero: true,
      },
    },
  };

  const handleDownload = () => {
    const report = {
      tanggal_prediksi: tanggalPrediksi,
      estimasi_omzet: estimasiOmzet,
      estimasi_porsi: estimasiPorsi,
      restock: restockAlerts,
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prediksi-penjualan-${tanggalPrediksi || "terbaru"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Prediksi Sales & Restock</h2>
          <p className="text-gray-500">Optimalkan inventaris Anda berdasarkan prediksi omzet.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            disabled={loading || !!error}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-bold text-sm border border-blue-100 disabled:opacity-50 cursor-pointer"
          >
            <Download size={18} /> Download Report
          </button>
          <button
            onClick={loadPrediction}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-lg font-bold text-sm shadow-md disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} /> Update Data
          </button>
        </div>
      </header>

      {error && (
        <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-400 py-20">Memuat prediksi...</p>
      ) : (
        <>
          {/* Revenue Card + Donut Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-20 -mt-20 opacity-50"></div>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider">
                Estimated Revenue
              </span>
              <h3 className="text-4xl font-bold text-gray-900 mt-4">
                {formatRupiah(estimasiOmzet)}
              </h3>
              <p className="text-gray-500 font-medium mt-2">
                Prediksi untuk {tanggalPrediksi || "-"}
              </p>

              <div className="grid grid-cols-3 gap-4 mt-10 pt-6 border-t border-gray-50">
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase">Prediksi Order</p>
                  <p className="text-lg font-bold text-gray-900">
                    {totalPorsi.toLocaleString("id-ID")}{" "}
                    <span className="text-sm font-normal text-gray-500">Porsi</span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase">Mie Ayam</p>
                  <p className="text-lg font-bold text-gray-900">
                    {porsiMie.toLocaleString("id-ID")} Porsi
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase">Jus</p>
                  <p className="text-lg font-bold text-gray-900">
                    {porsiJus.toLocaleString("id-ID")} Porsi
                  </p>
                </div>
              </div>
            </div>

            {/* Donut Chart (Komposisi Mie Ayam vs Jus) */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
              <p className="text-sm font-bold text-gray-900 mb-6 w-full">Komposisi Estimasi</p>
              <div className="relative w-48 h-48">
                <Doughnut data={donutData} options={donutOptions} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-gray-900">{totalPorsi}</span>
                  <span className="text-xs text-gray-400 font-medium">Porsi</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-6 text-center">
                Mie Ayam {porsiMie} & Jus {porsiJus} porsi
              </p>
            </div>
          </div>

          {/* Bar Chart + Restock Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold text-gray-900">Estimasi Porsi per Menu</h3>
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
                    <div className={`${item.iconBg} p-3 rounded-xl`}>
                      <ShoppingCart className="text-white" size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        Estimasi: {item.estimasi} | <span className={item.color}>{item.status}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SalesPrediction;
