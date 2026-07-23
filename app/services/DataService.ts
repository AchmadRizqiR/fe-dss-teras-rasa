// app/services/DataServices.ts

export type OmzetTrendData = {
  labels: string[];
  data: number[];
};

export type KpiData = {
  total_penjualan_mie_ayam: number;
  jus_terlaris: string;
  jus_tersepi: string;
};

export type PredictOmzetData = {
  message: string;
  tanggal_prediksi: string;
  estimasi_omzet: number;
};

export type TrainStatusData = {
  status: string;
  terakhir_train: string | null;
};

export type ApiError = {
  error: true;
  message: string;
};

class DataService {
  static async fetchKPI(): Promise<KpiData | null> {
    try {
      const response = await fetch(`/api/kpi`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const raw = await response.json();
      return raw.kpi as KpiData;
    } catch (error) {
      console.error("DataServices Error (kpi):", error);
      return null;
    }
  }

  static async fetchPieData() {
    try {
      const response = await fetch(`/api/menu-composition`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const raw = await response.json();
      console.log(raw);
      // Transform → Chart.js Pie format
      return {
        labels: raw.labels,
        datasets: [
          {
            data: raw.data,
            backgroundColor: [
              "#1e40af", // Mangga
              "#3b82f6", // Mie Ayam
              "#60a5fa", // Jeruk
              "#93c5fd", // Alpukat
              "#bfdbfe", // Jambu
            ],
            borderWidth: 0,
          },
        ],
      };
    } catch (error) {
      console.error("DataServices Error (menu-composition):", error);
      return null;
    }
  }

  static async fetchOmzetTrend(): Promise<OmzetTrendData | null> {
    try {
      const response = await fetch(`/api/omzet-trend`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const raw = await response.json();

      return {
        labels: raw.labels as string[],
        data: raw.data as number[],
      };
    } catch (error) {
      console.error("DataServices Error (omzet-trend):", error);
      return null;
    }
  }

  static async fetchPredictOmzet(): Promise<PredictOmzetData> {
    const response = await fetch(`/api/predict-omzet`);
    if (!response.ok) {
      let message = "Gagal memuat prediksi omzet.";
      try {
        const err = await response.json();
        if (err.detail) message = err.detail;
        else if (err.message) message = err.message;
      } catch {
        /* ignore parse error */
      }
      throw new Error(message);
    }
    return (await response.json()) as PredictOmzetData;
  }

  static async uploadHarian(file: File): Promise<{ message: string; status_hari_ini: any }> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`/api/upload-harian`, {
      method: "POST",
      body: formData,
    });

    const raw = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(raw.detail || raw.message || "Gagal mengunggah file.");
    }
    return raw as { message: string; status_hari_ini: any };
  }

  static async fetchTrainStatus(): Promise<TrainStatusData> {
    const response = await fetch(`/api/train-status`);
    if (!response.ok) {
      throw new Error("Gagal memuat status model.");
    }
    return (await response.json()) as TrainStatusData;
  }

  static async retrainManual(): Promise<{ message: string }> {
    const response = await fetch(`/api/retrain-manual`, { method: "POST" });
    if (!response.ok) {
      let message = "Gagal memicu retraining.";
      try {
        const err = await response.json();
        if (err.detail) message = err.detail;
        else if (err.message) message = err.message;
      } catch {
        /* ignore */
      }
      throw new Error(message);
    }
    return (await response.json()) as { message: string };
  }
}

export default DataService;
