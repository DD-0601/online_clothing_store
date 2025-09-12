import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import pkg from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const { Pool } = pkg;

const app = express();
const PORT = process.env.PORT || 3001; //線上部署時是process.env.PORT，本地時用指定的port


if (process.env.NODE_ENV !== "production") {
    // ✅ 本地環境：需要讀取 .env 檔案 ; render / 線上環境：直接用 process.env，不需要呼叫 dotenv.config()去找.env 檔案
    dotenv.config({ path: "../.env" });
    console.log("Running locally, loaded .env");
}

app.use(cors());
app.use(express.json());

// 設定 postgres 資料庫連線
// const pool = new Pool ({
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     database: process.env.DATABASE,
//     password: process.env.DB_PASSWORD,
//     port: process.env.DB_PORT,
// });
let pool;

if (process.env.DATABASE_URL) {
    // Render / 雲端環境
    pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // Render 預設需要這個
    },
    });
} else {
  // 本地開發環境
    pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DATABASE,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    });
}

// API: 取得商品categories
app.get("/api/categories", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM categories");
        res.json(result.rows);
    } catch (err) {
        console.error("Error querying database:", err);
        res.status(500).json({ error: " Internal server error" });
    }
});

// API: 取得單一商品category
app.get("/api/category/:category", async (req, res) => {
    try {
        const category = req.params.category;
        const result = await pool.query("SELECT * FROM carousel_img WHERE is_shown = true AND shown_location = 'ProductCategory' AND category = $1 ORDER BY is_shown ASC", [category]);
        res.json(result.rows);
    } catch (err) {
        console.error("Error querying database for single category:", err);
        res.status(500).json({ error: " Internal server error" });
    }
});

// 註冊帳號
app.post("/api/register", async (req, res) => {
    const {email, password, name, phone, zipCode, city, street} = req.body;

    if (!email || !password || !name || !zipCode || !city || !street) {
        return res.status(400).json({message: "資料不完整。"})
    }

    try {
        // 檢查信箱是否已註冊
        const existingMember = await pool.query("SELECT id FROM members WHERE email = $1", [email]);

        if (existingMember.rows.length > 0) {
            return res.status(409).json({message: "此信箱已被註冊。"});
        }

        // 加密密碼
        const hashedPassword = await bcrypt.hash(password, 10); // 參數：要hash的東西，hash的次數

        // 寫入資料庫(欄位名稱要與資料庫一致)
        const result = await pool.query("INSERT INTO members (email, password_hash, name, phone, zip_code, city, street) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",[email, hashedPassword, name, phone, zipCode, city, street]);

        // 建立 JWT token
        const id = result.rows[0].id;
        const token = jwt.sign(
            {id, name, phone, zipCode, city, street},
            process.env.JWT_SECRET,
            {expiresIn: "7d"}
        );

        res.status(201).json({
            message: "註冊成功。",
            token,
        });
    } catch (err) {
        console.error("Register error: ", err);
        res.status(500).json({
            message: "伺服器錯誤。",
            error: err.message,
        });
    }
})

// 帳號登入
app.post("/api/login", async (req, res) => {
    const {email, password} = req.body;

    try {
        const result = await pool.query("SELECT * from members WHERE email = $1", [email]);
        if (result.rows.length === 0) {
            // 無此使用者的情況：
            return res.status(401).json({message: "無此使用者"});
        }
        // 有此使用者的時，比對輸入的密碼與資料庫的hashed密碼：
        const match = await bcrypt.compare(password, result.rows[0].password_hash);
        if (!match) {
            return res.status(401).json({message: "密碼有誤"});
        }
    
        // 密碼正確時，回傳token至前端
        const { id, name, phone, zip_code: zipCode, city, street } = result.rows[0];
        const token = jwt.sign(
            {id, name, phone, zipCode, city, street},
            process.env.JWT_SECRET,
            {expiresIn: "7d"},
        )
        res.json({
            message: "登入成功！",
            token: token,
        });
    } catch (err) {
        console.error("Login error: ", err);
        res.status(500).json({
            message: "伺服器錯誤",
            error: err.message,
        });
    };
});

// 建立訂單資料到資料庫的orders, order_items
app.post("/api/orders", async (req, res) => {
        const { shippingInfo, totalPrice, cart } = req.body;
    
    try {
        const fullAddress = `${shippingInfo.zipCode} ${shippingInfo.city} ${shippingInfo.street}`;
        const newOrder = await pool.query("INSERT INTO orders (user_id, total_amount, recipient_name, recipient_phone, shipping_address, payment_method) VALUES ($1, $2, $3, $4, $5, $6) RETURNING order_id", [
            shippingInfo.userID,
            totalPrice,
            shippingInfo.recipientName,
            shippingInfo.recipientPhone,
            fullAddress,
            shippingInfo.method,
        ]);
        const newOrderID = newOrder.rows[0].order_id;
        // 🌟 插入多筆資料時，使用Promise.all()會等所有 query 完成後再繼續，保證資料都寫入，而只用await的話則是只等 map 完成生成 Promise 陣列，不等 query 完成。
        const newOrderItems = await Promise.all(
            cart.map((item) => pool.query("INSERT INTO order_items (order_id, product_id, product_name, product_url, product_price, quantity, subtotal) VALUES ($1, $2, $3, $4, $5, $6, $7)", [
                newOrderID,
                item.id,
                item.name,
                item.picURL,
                item.price,
                item.quantity,
                (item.price * item.quantity),
            ])));

        console.log("所有訂單商品已成功寫入資料庫！");

        res.status(201).json({
            message: "已成功將訂單送至後端資料庫！",
        });
    } catch (err) {
        res.status(500).json({message: "無法將訂單寫入資料庫！", error: err.message});
    }
});

// 查看訂單資料
app.get("/api/order_items/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const result = await pool.query("SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC", [id]);
        const orderData = result.rows;
        const itemResult = await Promise.all(
            orderData.map(async item => {
                const itemRes = await pool.query("SELECT * FROM order_items WHERE order_id = $1", [item.order_id]);
                // 🌟 回傳的 items 是在組裝回傳資料時 自訂建立的 property，非資料庫原本table裡的欄位
                return {...item, items: itemRes.rows}
            })
        );

        res.status(200).json({
            message: "訂單查詢成功！",
            fetchedOrders: itemResult,
        });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({error: err.message});
    }
})

// Only add SPA fallback if dist/index.html exists
if (process.env.NODE_ENV === "production" && fs.existsSync(indexHtmlPath)) {
    // 把 build 資料夾當靜態檔案
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    app.use(express.static(path.join(__dirname, "../dist")));
    const indexHtmlPath = path.join(__dirname, "../dist", "index.html");
    console.log("Serving static files（靜態資料夾） from:", path.join(__dirname, "../dist"));
    console.log("indexHtmlPath 為：", indexHtmlPath);
    console.log("index.html path 為：", indexHtmlPath, fs.existsSync(indexHtmlPath));

    // SPA fallback：非 API 路由都導向 index.html，注意要放在所以API路由的程式碼之後，讓API可以先被執行。
    app.get("*", (req, res) => {
        res.sendFile(indexHtmlPath);
    });
}

app.listen(PORT, () => {
    console.log(`Server is now running on PORT: ${PORT}`)
});