import fs from "fs"
import path from "path"
import axios from "axios"
import { fileURLToPath } from 'url';
import dotenv from "dotenv"
dotenv.config({path: "../.env"});

async function fetchAndSave(category) {

    // 設定檔案路徑
    const __fileName = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__fileName);
    const filePath = path.join(__dirname, `../mock_data/mockProductCategory_${category}.json`);

    // 檢查是否已有檔案
    if (fs.existsSync(filePath)) {
        console.log(`${category} category的JSON檔案已存在，略過請求。`);
        return;
    }

    // 如檔案不存在時，發送request 並 存成 JSON
    try {
        const options = {
            method: 'GET',
            url: 'https://apidojo-hm-hennes-mauritz-v1.p.rapidapi.com/products/list',
            params: {
                country: 'us',
                lang: 'en',
                currentpage: '2',
                pagesize: '20',
                categories: category,
            },
            headers: {
                'x-rapidapi-key': process.env.VITE_RAPID_API_KEY,
                'x-rapidapi-host': process.env.VITE_RAPID_API_HOST,
            }
        };

        const response = await axios.request(options);
        const productList = response.data;
        // JSON.stringify(value, replacer, space)
        // replacer（要排除/挑選哪些欄位）null 表示「不排除任何欄位」，完整輸出。
        // space（縮排用的空白數）傳 2 的意思是：每層縮排用兩個空白，產生的 JSON 比較漂亮、易讀。
        fs.writeFileSync(filePath, JSON.stringify(productList, null, 2), "utf-8");
        console.log(`成功儲存${category}的資料到${filePath}`);
    } catch (err) {
        console.error("API請求失敗：", err.message);
    }
}

// 以下為已執行過，並取得資料的部分。
// fetchAndSave("ladies_all");
// fetchAndSave("men_all");
// fetchAndSave("kids_all");
// fetchAndSave("sportswear");