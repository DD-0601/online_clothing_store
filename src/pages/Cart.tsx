import Header from "../components/Header"
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import "../pages/Cart.css"
import { useShoppingCart } from "../contexts/ShoppingCartContext";
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import { useNavigate, Navigate, useLocation } from "react-router-dom"; // useNavigate是函式，Navigate是component必須作為 JSX 的一部分
import { useAuth } from "../contexts/AuthContext";

// 設定貨幣的幣值 & 小數點後2位，會自動加上$符號
const formatter = new Intl.NumberFormat("en-US", {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2, // 會自動四捨五入到指定的小數位數
    maximumFractionDigits: 2,
});

function Cart() {
    // 檢查是否已登入，未登入則導至/authorize，並用from傳送cart這頁的location，讓AuthProvider內的login使用from的location會到cart這頁
    const { isLoggedIn } = useAuth();
    const location = useLocation();
    if (!isLoggedIn) {
        return <Navigate to={"/authorize"} state={{from: location}} replace></Navigate>
    }

    const navigate = useNavigate();
    // 捲動後 header添加陰影
    const [hasShadow, setHasShadow] = useState(false);
    useEffect(() => {
        const handleShadow = () => {
            setHasShadow(window.scrollY > 0);  //如果Y捲動 > 0時會返回true
        }
        window.addEventListener("scroll", handleShadow);
        return () => removeEventListener("scroll", handleShadow); //清理事件
    }, [])

    const discount = 0;
    const deliveryFee = 0;
    const {cart, dispatch, totalPrice, totalQuantity} = useShoppingCart();

    // 空購物車時，倒數3秒跳轉至首頁
    const [countdown, setCountDown] = useState(5);
    useEffect(() => {
        if (cart.length === 0) {
            // 每隔一秒就將countdown 減 1
            const interval = setInterval(() => {
                setCountDown((prev) => prev - 1);
            }, 1000);
    
            const timer = setTimeout(() => {
                navigate("/"); // 5 秒後回首頁
            }, 5000);
    
            return () => {
                clearInterval(interval);
                clearTimeout(timer);
            };
        }
    }, [cart, navigate]);
    return (
        <>
        <div id="cart-page-wrapper">
            <Header OptionalStyle={`position-fixed header-optional-class ${hasShadow ? "header-shadow" : ""}`}></Header>
            <div id="cart" className="container">
                {cart.length === 0 ? ( // 購物車是空的才顯示訊息
                    <div id="empty-cart-note" className="text-center text-muted">
                        <h5>The cart is currently empty.</h5>
                        <div>Directing to Home page in {countdown} seconds.</div>
                    </div>
                ) : (
                <div className="row d-flex flex-column justify-content-center align-items-center flex-nowrap mx-1 mx-sm-0">
                    {cart.map((item) => {
                        return (
                            <div className="col-12 col-sm-12 col-md-10 col-lg-8 cart-card d-flex justify-content-center position-relative" key={item.id}>
                                <div className="cart-card-close position-absolute top-0 end-0">
                                    <i className="fa-solid fa-xmark pe-1" onClick={() => {
                                        dispatch({
                                            type: "REMOVE_ITEM",
                                            payload: {id: item.id},
                                        })
                                    }}></i>
                                </div>
                                <div className="cart-pic col-4 col-md-5 d-flex justify-content-center align-items-center">
                                    <img className="cart-card-img img-fluid" src={item.picURL} alt={item.name}
                                    onClick={() =>
                                    // 刪去id後的size，只留商品原始id的10碼
                                    navigate(`/product/${item.id.slice(0, 10)}`)} />
                                </div>
                                <div className="cart-detail col-6 col-md-5 d-flex flex-column justify-content-center align-items-start ms-2">
                                    <div className="cart-product-name flex-grow-0 flex-shrink-0 w-100" style={{flexBasis: "40%"}}>{item.name}</div>
                                    <div className="cart-product-color-and-size flex-grow-0 flex-shrink-0 d-flex justify-content-start align-items-center w-100"  style={{flexBasis: "20%"}}>
                                        <div className="cart-product-color col-6 d-flex align-items-center">Color:<span className="color-circle ms-1" style={{backgroundColor: `${item.colorHex}`}}></span></div>
                                        <div className="cart-product-size col-6">Size:{item.size}</div>
                                    </div>
                                    <div className="cart-product-price-and-qty flex-grow-0 flex-shrink-0 d-flex justify-content-start align-items-end pb-3 w-100" style={{flexBasis: "40%"}}>
                                        <div className="cart-product-price col-6">{formatter.format(item.price * item.quantity)}</div>
                                        <div className="cart-product-qty col-6 d-flex justify-content-center align-items">
                                            <button>
                                                <i className="fa-solid fa-minus" style={item.quantity === 1 ? { color: "#D3D3D3"} : { color: "#140005"}} onClick={() => {
                                                    dispatch({
                                                        type: "DECREMENT_QUANTITY",
                                                        payload: {id: item.id},
                                                    })
                                                }}></i>
                                            </button>
                                            <span>{item.quantity}</span>
                                            <button>
                                                <i className="fa-solid fa-plus" onClick={() => {
                                                    dispatch({
                                                        type: "INCREMENT_QUANTITY",
                                                        payload: {id: item.id},
                                                    })
                                                }}></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                )}
            </div>
            
            {cart.length > 0 && ( // 購物車有東西才顯示結帳的區塊
            <div id="cart-check-out" className="container p-3 pt-5">
                <div className="row">
                    <div id="cart-subtotal" className="col-12 col-sm-12 col-md-8 col-lg-6 d-flex flex-column justify-content-center align-items-center mb-5 mx-auto">
                        <div id="subtotal-price" className="w-100 d-flex justify-content-between align-items-center mb-1">
                            <span>Total Price</span>
                            <span>{formatter.format(totalPrice)}</span>
                        </div>
                        <div id="total-items" className="w-100 d-flex justify-content-between align-items-center mb-1">
                            <span>Total Items</span>
                            <span>{totalQuantity}</span>
                        </div>
                        <div id="discount" className="w-100 d-flex justify-content-between align-items-center mb-1">
                            <span>Discount</span>
                            <span>{`$${discount}`}</span>
                        </div>
                        <div id="delivery-fee" className="w-100 d-flex justify-content-between align-items-center mb-1">
                            <span>Delivery Fees</span>
                            <span>Free</span>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div id="cart-total" className="col-12 col-sm-12 col-md-8 col-lg-6 d-flex flex-column justify-content-center align-items-center mx-auto">
                        <div id="total-price" className="w-100 d-flex justify-content-between align-items-center mb-3">
                            <span>Total:</span>
                            <span>{formatter.format(totalPrice-discount+deliveryFee)}</span>
                        </div>
                        <button id="cart-check-out-button" className="w-100 align-self-center mb-3"
                        onClick={() => navigate("/checkout")}>
                            <ShoppingCartCheckoutIcon></ShoppingCartCheckoutIcon>CHECK OUT
                        </button>
                        <button id="cart-clear-cart-button" className="w-100 align-self-center mb-3"
                        onClick={() => {
                            const confirmClear = window.confirm("Are you sure you want to clear the cart?");
                            if (confirmClear) {
                                dispatch({type: "CLEAR_CART"});
                            }
                        }}>
                            <RemoveShoppingCartIcon></RemoveShoppingCartIcon>CLEAR CART
                        </button>
                    </div>
                </div>
            </div>
            )}
            <Footer></Footer>
        </div>
        </>
    )
}

export default Cart;