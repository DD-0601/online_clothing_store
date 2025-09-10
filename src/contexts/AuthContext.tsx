import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
// import { useShoppingCart } from "./ShoppingCartContext";

interface User {
    id: string,
    name: string,
    phone: string,
    zipCode: string,
    city: string,
    street: string,
}
// 建立context & context接受的型別與值
const AuthContext = createContext<{
    isLoggedIn: boolean;             // 表示使用者是否已登入
    login: (token: string) => void;  // 接收 token 並登入的函式
    logout: () => void;              // 登出函式，清除 token 並設為未登入
    // userInfo用來接受後端回傳的token內的使用者資料
    userInfo: User | null;
}>({
    isLoggedIn: false,               // 預設未登入
    login: () => {},                 // 預設空函式，實際登入、登出邏輯在 Provider 中定義
    logout: () => {},
    userInfo: null,
})
// 建立context provider 元件，讓整個app能共享登入狀態
export const AuthProvider = ({children} : {children: React.ReactNode}) => {
    const navigate = useNavigate();
    const location = useLocation();  // 取得location.state
    
    // 建立更新使用者資料的hook
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decodedToken = jwtDecode<User>(token);
            setUser(decodedToken);
            // console.log("解密的Token的userInfo是：", decodedToken);
        }
    }, [])
    // 檢查localstorage是否有token來判定 true 或 false
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("token") !== null);

    // 登入函式：儲存 token 並更新狀態為已登入
    const login = (token: string) => {
        localStorage.setItem("token", token);
        setIsLoggedIn(true);

        const decodedToken = jwtDecode<User>(token);
        setUser(decodedToken); // 將user的資料設為新登入者

        // console.log("token內容是：", token);
        console.log("context login被執行了");

        // 如果from帶有值，就回到該.pathname的路由 ； 無值就回到首頁
        const from = (location.state as {from?: Location})?.from?.pathname || "/";
        // 🌟 navigate到from得到的路徑(字串)，並replace取代目前登入頁的歷史紀錄，這樣使用者點瀏覽器的「返回」按鈕時，不會回到登入頁，而是回到更前一個頁面。
        navigate(from, {replace: true});
    }
    // 登出函式：移除 token 並更新狀態為未登入
    const logout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setUser(null); // 清空 user 資料，沒清的話，userInfo會一直是之前登入的資料
        console.log("context logout被執行了");
        navigate("/"); // 登出後 回首頁
    }
    // 將登入狀態、登入與登出函式傳給所有子元件
    return (
        <AuthContext.Provider value={{isLoggedIn, login, logout, userInfo: user}}>
            {children}
        </AuthContext.Provider>
    );
}

// 自訂 Hook：提供方便使用 Context 的方法
    // 使用這個 hook 就能取得 isLoggedIn, login, logout 等狀態
export const useAuth = () => useContext(AuthContext);