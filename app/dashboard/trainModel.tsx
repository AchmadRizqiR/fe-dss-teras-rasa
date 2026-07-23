import React, { useState, useEffect, useCallback } from "react";
import {
  RefreshCw,
  Play,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import DataService from "../services/DataService";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const performanceData = {
  labels: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
  datasets: [
    {
      label: "Predicted",
      data: [45, 75, 55, 95, 65, 85, 70],
      backgroundColor: "#1e3a8a",
      borderRadius: 4,
      barPercentage: 0.5,
    },
    {
      label: "Actual",
      data: [42, 80, 50, 90, 68, 82, 72],
      backgroundColor: "#94a3b8",
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
      position: "top" as const,
      labels: {
        boxWidth: 12,
        padding: 20,
        font: { size: 10, weight: "bold" as const },
        color: "#94a3b8",
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
      ticks: { font: { size: 10, weight: "bold" as const }, color: "#94a3b8" },
    },
    y: {
      grid: { color: "#f1f5f9" },
      ticks: { font: { size: 10 }, color: "#94a3b8" },
      beginAtZero: true,
    },
  },
};

const TrainModel = () => {
  // Train state
  const [lastTrained, setLastTrained] = useState<string | null>(null);
  const [modelStatus, setModelStatus] = useState<string>("Memuat...");
  const [training, setTraining] = useState(false);
  const [trainMsg, setTrainMsg] = useState<string | null>(null);
  const [trainErr, setTrainErr] = useState<string | null>(null);

  const loadTrainStatus = useCallback(async () => {
    try {
      const data = await DataService.fetchTrainStatus();
      setModelStatus(data.status || "Ready");
      setLastTrained(data.terakhir_train);
    } catch (err: any) {
      setModelStatus("Error");
      setTrainErr(err?.message || "Gagal memuat status model.");
    }
  }, []);

  useEffect(() => {
    loadTrainStatus();
  }, [loadTrainStatus]);

  const handleRetrain = async () => {
    setTraining(true);
    setTrainErr(null);
    setTrainMsg(null);
    try {
      const res = await DataService.retrainManual();
      setTrainMsg(res.message);
    } catch (err: any) {
      setTrainErr(err?.message || "Gagal memicu retraining.");
    } finally {
      setTraining(false);
      loadTrainStatus();
    }
  };

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
            <button
              onClick={loadTrainStatus}
              disabled={training}
              className="flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw size={18} className={training ? "animate-spin" : ""} /> Refresh Status
            </button>
            <button
              onClick={handleRetrain}
              disabled={training}
              className="flex items-center gap-2 px-6 py-3 bg-blue-800 text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 hover:bg-blue-900 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Play size={18} fill="currentColor" /> {training ? "Training..." : "Start Retraining"}
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
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> {modelStatus}
              </span>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-400">Model Version</p>
                <p className="text-lg font-mono font-bold text-blue-900">LSTM-Omzet</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Last Trained</p>
                <p className="text-sm font-bold text-gray-900">
                  {lastTrained || "Belum pernah"}
                </p>
              </div>
            </div>
          </div>

          {trainMsg && (
            <div className="bg-white p-4 rounded-2xl border-l-4 border-l-blue-500 border border-gray-100 shadow-sm">
              <div className="flex gap-3 items-start">
                <CheckCircle2 size={18} className="text-blue-600 mt-0.5" />
                <p className="text-xs text-gray-700 font-medium">{trainMsg}</p>
              </div>
            </div>
          )}

          {trainErr && (
            <div className="bg-white p-4 rounded-2xl border-l-4 border-l-red-500 border border-gray-100 shadow-sm">
              <div className="flex gap-3 items-start">
                <AlertTriangle size={18} className="text-red-600 mt-0.5" />
                <p className="text-xs text-gray-700 font-medium">{trainErr}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="col-span-12 lg:col-span-9 space-y-6">
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
        </div>
      </div>
    </div>
  );
};

export default TrainModel;
