import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";;

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            "/api": {
                target: "http://localhost:3001", // 後端 API 的網址
                changeOrigin: true,
            },
        },
    },
});

// vite.config.ts（檔名不可變） 裡的 proxy 設定是 Vite 開發伺服器的設定檔，
// 只在啟動開發環境 (npm run dev) 的時候由 Vite 自動生效，不需要在程式碼中 import。