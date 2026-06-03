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

class DataService {
    static async fetchKPI(): Promise<KpiData | null> {
        try {
            const response = await fetch(`/api/kpi`);
            const raw = await response.json();
            return raw.kpi as KpiData;
        } catch (error) {
            console.error('DataServices Error (kpi):', error);
            return null;
        }
    }

    static async fetchPieData() {
        try {
            const response = await fetch(`/api/menu-composition`);
            const raw = await response.json();
            console.log(raw);
            // Transform → Chart.js Pie format
            return {
                labels: raw.labels,
                datasets: [
                {
                    data: raw.data,
                    backgroundColor: [
                    '#1e40af', // Mangga
                    '#3b82f6', // Mie Ayam
                    '#60a5fa', // Jeruk
                    '#93c5fd', // Alpukat
                    '#bfdbfe', // Jambu
                    ],
                    borderWidth: 0,
                },
                ],
            };
        } catch (error) {
            console.error('DataServices Error:', error);
            return null;
        }
    }

    static async fetchOmzetTrend(): Promise<OmzetTrendData | null> {
        try {
            const response = await fetch(`/api/omzet-trend`);
            const raw = await response.json();

            return {
                labels: raw.labels as string[],
                data: raw.data as number[],
            };
        } catch (error) {
            console.error('DataServices Error (omzet-trend):', error);
            return null;
        }
    }
}

export default DataService;