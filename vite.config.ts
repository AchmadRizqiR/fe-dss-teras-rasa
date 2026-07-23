import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter()],
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    proxy: {
      // Setiap kali frontend request ke '/api', Vite akan nge-forward ke target
      '/api': {
        target: 'http://mppl.rutherweb.my.id',
        changeOrigin: true,
        secure: false, // Tambahin ini kalau SSL/HTTPS targetnya bermasalah
      }
    }
  },
});
