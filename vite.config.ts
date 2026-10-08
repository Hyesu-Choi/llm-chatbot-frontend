import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const API_PROXY_TARGET = process.env.VITE_API_PROXY_TARGET ?? "http://localhost:8000";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // 개발 중에는 /api 요청을 FastAPI로 넘겨서 CORS 없이 같은 origin처럼 쓴다
    proxy: {
      "/api": API_PROXY_TARGET,
    },
  },
});
