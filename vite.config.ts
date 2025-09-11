import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";;

export default defineConfig(({ mode }) => {

    const env = loadEnv(mode, ".", "");

    return {
        plugins: [react()],
        server: {
            proxy: {
                "/api": {
                    target: env.VITE_APP_API_URL, // 後端 API 的網址(一般是http://localhost:3001/之類的，此處用env寫，方便線上部署時更換成frontend url)
                    changeOrigin: true,
                },
            },
        },
    };
});

// vite.config.ts（檔名不可變） 裡的 proxy 設定是 Vite 開發伺服器的設定檔，
// 只在啟動開發環境 (npm run dev) 的時候由 Vite 自動生效，不需要在程式碼中 import。