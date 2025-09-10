// import context, reducer, useEffect 相關
import { useContext, createContext, useReducer, useEffect } from "react";
import { useAuth } from "./AuthContext";

// 定義購物車商品型別，需export供其他component使用
export type CartItem = {
    id: string;
    name: string;
    price: number;
    size: string;
    colorHex: string;
    colorName: string;
    quantity: number;
    picURL: string;
}

// 定義購物車狀態為 CartItem 陣列，僅在此檔案中使用，不需export
type CartState = CartItem[];

// 定義購物車行為（action）型別，需export供其他component使用
export type CartAction =
| {type: "ADD_ITEM", payload: CartItem}
| {type: "REMOVE_ITEM", payload: {id: string}}
| {type: "INCREMENT_QUANTITY", payload: {id: string}}
| {type: "DECREMENT_QUANTITY", payload: {id: string}}
| {type: "CLEAR_CART"}
| {type: "SET_CART", payload: CartState}

// 使用reducer(要有state與action)搭配switch(action.type)設定每個action要執行的動作
function cartReducer(state: CartState, action: CartAction): CartState {
    switch(action.type) {
        // 每個case後的statement加上 {} 的主要目的在於 建立區域變數作用域（block scope） or 在不同case的statement內建立同名變數會報錯。
        case "ADD_ITEM": {
            const item = action.payload;
            const existingItem = state.find((i) => i.id === item.id);
            if (existingItem) {
                // 商品已存在購物車時 增加輸入的數量
                return state.map((i) => i.id === item.id ? {...i, quantity: i.quantity + item.quantity} : i);
            } else {
                // 商品不存在購物車時 將商品加入
                return [...state, item];
            }
        }
        case "REMOVE_ITEM": {
            const item = action.payload;
            return state.filter((i) => i.id !== item.id);
        }
        case "INCREMENT_QUANTITY": {
            const item = action.payload;
            return state.map((i) => i.id === item.id ? {...i, quantity: i.quantity + 1} : i)
        }
        case "DECREMENT_QUANTITY": {
            const item = action.payload;
            // 最小不會低於1
            return state.map((i) => i.id === item.id ? {...i, quantity: Math.max(1, i.quantity - 1)} : i)
        }
        case "CLEAR_CART": {
            return [];
        }
        case "SET_CART": {
            return action.payload;
        }
        default:
            return state;
    }
}


// 建立 context 類型，設定React.Dispatch函式接受的類型參數
type ShoppingCartContextType = {
    cart: CartState;
    dispatch: React.Dispatch<CartAction>;
    totalPrice: number;
    totalQuantity: number;
}

// ⬇️ 提供 cart & dispatch 給全站使用
const ShoppingCartContext = createContext<ShoppingCartContextType | undefined>(undefined);

// 合併user與guest購物車 的function
function mergeCarts(userCart: CartItem[], guestCart: CartItem[]) {
    const merged = [...userCart];

    guestCart.forEach(guestItem => {
        const existingIndex = merged.findIndex(item => item.id === guestItem.id);
        if (existingIndex >= 0) {
            // 如果商品已存在userCart，加上questCart的數量
            merged[existingIndex].quantity += guestItem.quantity;
        } else {
            // 商品不存在userCart時，則將整個item push進merged
            merged.push(guestItem);
        }
    });

    return merged;
}

const GUEST_CART_KEY = "shopping_cart_quest";
const USER_CART_PREFIX = "shopping_cart_user_";

// ⬇️ context 提供器 component & 設定local storage快取
export function ShoppingCartProvider({children}: {children: React.ReactNode}) {
    const { isLoggedIn, userInfo } = useAuth();

    // 動態建立storage key
    const storageKey = isLoggedIn && userInfo?.id
    ? `${USER_CART_PREFIX}${userInfo.id}`
    : GUEST_CART_KEY;

    // ✅ 一開始就從 localStorage 載入初始值
    const [cart, dispatch] = useReducer(cartReducer, [], () => {
        const stored = localStorage.getItem(storageKey);
        return stored ? JSON.parse(stored) : [];
    });
    
    // 登入時合併購物車 & 依登入狀態載入user or guest 的 cart
    useEffect(() => {
        if (isLoggedIn && userInfo?.id) {
            const guestCartString = localStorage.getItem(GUEST_CART_KEY);
            const userCartString = localStorage.getItem(storageKey);
        
            const guestCart: CartItem[] = guestCartString ? JSON.parse(guestCartString) : [];
            const userCart: CartItem[] = userCartString ? JSON.parse(userCartString) : [];

            // 使用自訂function合併user cart 與 guest cart
            const merged = mergeCarts(userCart, guestCart);

            // 合併後 存回使用者購物車
            localStorage.setItem(storageKey, JSON.stringify(merged));
            dispatch({type: "SET_CART", payload: merged});

            // 清空quest cart
            localStorage.removeItem(GUEST_CART_KEY);
        } else {
            // 未登入時 讀取guest cart
            const guestCartString = localStorage.getItem(GUEST_CART_KEY);
            const guestCart: CartItem[] = guestCartString ? JSON.parse(guestCartString) : [];  // 因為有可能沒有guestCartString，guestCartString是null的情況下會報錯，故用三元運算子
            dispatch({type: "SET_CART", payload: guestCart});
        }
    }, [isLoggedIn, userInfo?.id]);

    // ✅ 每次 cart 或 storageKey 改變時，寫入正確的 localStorage
    useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify(cart));
    }, [cart, storageKey]);
    // 監控isLoggedIn跟UserInfo.id
    // useEffect(() => {
    //     console.log("isLoggedId的變化：", isLoggedIn);
    //     console.log("UserInfo.id的變化：", userInfo?.id);
    // }, [isLoggedIn, userInfo?.id]);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <ShoppingCartContext.Provider value={{cart, dispatch, totalPrice, totalQuantity}}>
            {children}
        </ShoppingCartContext.Provider>
    )
}

// ⬇️ 全站使用的 hook
export function useShoppingCart() {
    const context = useContext(ShoppingCartContext);
    if (!context) {
        throw new Error("useShoppingCart 必須被包在 <ShoppingCartProvider> 內");
    }
    return context;
}