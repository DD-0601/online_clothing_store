import Header from "../components/Header";
import Footer from "../components/Footer";
import "../pages/CheckOut.css"
import { useState } from "react";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useShoppingCart } from "../contexts/ShoppingCartContext";

const paymentOptions = [
    {
        name: "Credit Card",
        picURL: "/payment/credit_card.png",
    },
    {
        name: "Paypal",
        picURL: "/payment/pay_pal.png",
    },
    {
        name: "Apple Pay",
        picURL: "/payment/apple_pay.png",
    },
];

type shippingForm = {
    userID: string,
    userName: string,
    recipientName: string,
    recipientPhone: string,
    method: string,
    zipCode?: string,
    city?: string,
    street?: string
    storeID?: string,
    storeName?: string,
    branchID?: string,
    branchName?: string,
}
function CheckOut() {
    //取得購物車資料，連同sihppingInfo一起送到後端
    const { cart, totalPrice, dispatch } = useShoppingCart();

    const navigate = useNavigate();
    
    // 取得使用者資料
    const { userInfo } = useAuth();
    // 控制表單各欄位顯示與否
    const [selectedForm, setSelectedForm] = useState("");

    const [paymentMethod, setPaymentMethod] = useState("Credit Card");

    // shipping 資料 初始時賦予空值
    const [shippingInfo, setShippingInfo] = useState<shippingForm>({
        userID: userInfo?.id || "",
        userName: userInfo?.name || "",
        recipientName: userInfo?.name || "",
        recipientPhone: userInfo?.phone || "",
        method: paymentMethod,
        zipCode: userInfo?.zipCode || "",
        city: userInfo?.city || "",
        street: userInfo?.street || "",
        storeID: "",
        storeName: "",
        branchID: "",
        branchName: "",
    });
    // 以下為觀察 訂單內容變化用
    // useEffect(() => {
    //     console.log("useEFFECT更新資料:", shippingInfo);
    //     console.log("cart 的內容物&金額：", cart, totalPrice);
    //     console.log("payment method是：", paymentMethod);
    // }, [shippingInfo, cart, paymentMethod]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const proceed = window.confirm("確定要送出訂單？");

        if (proceed) {
            console.log("前端shippingInfo:", shippingInfo);
            console.log("前端cart:", cart);
            console.log("使用者選擇確定送出訂單")
            const response = await fetch("/api/orders",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({shippingInfo, totalPrice, cart}),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("訂單成功送出", data.message);
                alert("訂單已送出，祝您有愉快的一天！");
                dispatch({type: "CLEAR_CART"}); // 成功送出訂單後 清空購物車
                navigate("/orders"); // 導向查看訂單頁面
            } else {
                console.log("訂單送出失敗：", data.message, data.error);
                alert("訂單送出失敗，請稍後再試，謝謝。");
            }

        } else {
            console.log("使用者選擇取消送出訂單");
        }
    }
    return (
        <>
        <div id="check-out-wrapper">
            <Header></Header>
            <div id="check-out">
                <form onSubmit={handleSubmit}>
                    <div id="payment" className="mb-3">
                        <div className="container">
                            <div className="row justify-content-center">
                                <div className="col-10 col-sm-10 col-md-6 section-background">
                                    <div>Payment:</div>
                                    {paymentOptions.map((payment, index) => (
                                    <div className="payment-card" key={index}>
                                        <label className="d-flex justify-content-start align-items-center">
                                            <img src={payment.picURL} alt={payment.name} className="me-1" />
                                            <span>{payment.name}</span>
                                            <input
                                            type="radio"
                                            name="paymentMethod"
                                            value={payment.name}
                                            checked={payment.name === paymentMethod}
                                            onChange={(e) => {
                                                setPaymentMethod(e.target.value);
                                                setShippingInfo({...shippingInfo, method: e.target.value});
                                                }} />
                                            {payment.name === paymentMethod ? (
                                                <RadioButtonCheckedIcon
                                                className="ms-auto" style={{fontSize: "1rem", color: "#6C6A61"}}></RadioButtonCheckedIcon>
                                            ) : (
                                                <RadioButtonUncheckedIcon
                                                className="ms-auto" style={{fontSize: "1rem", color: "#6C6A61"}}></RadioButtonUncheckedIcon>
                                            )}
                                        </label>
                                    </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* new section after this */}
                    <div id="shipping-info" className="mb-3">
                        <div className="container">
                            <div className="row justify-content-center">
                                <div className="col-10 col-sm-10 col-md-6 section-background">
                                    <div>Shipping Information:</div>
                                    <div id="home-delivery" className="mb-3">
                                        <label
                                            style={{ color: selectedForm !== "home-delivery" ? "#9E9E9E" : ""}}>
                                            {selectedForm === "home-delivery" ? (
                                                <RadioButtonCheckedIcon
                                                className="me-1" style={{fontSize: "1rem", color: "#6C6A61"}}></RadioButtonCheckedIcon>
                                            ) : (
                                                <RadioButtonUncheckedIcon
                                                className="me-1" style={{fontSize: "1rem", color: "#6C6A61"}}></RadioButtonUncheckedIcon>
                                            )}
                                            <input
                                            className="me-1"
                                            type="radio"
                                            name="shippingMethod"
                                            value={"home-delivery"}
                                            onChange={(e) => setSelectedForm(e.target.value)} />
                                            Home Delivery
                                        </label>
                                        {selectedForm === "home-delivery" && (
                                        <div id="address" className={`d-flex flex-column ${selectedForm === "home-delivery" ? "fade-slide" : ""}`}>
                                            <input className="mb-1 customized-placeholder" type="text" name="address-zip-code" placeholder="Zip-Code"
                                            value={shippingInfo.zipCode}
                                            onChange={(e) => (
                                                setShippingInfo({...shippingInfo, zipCode: e.target.value})
                                            )} />
                                            <input className="mb-1" type="text" name="address-city" placeholder="City"
                                            value={shippingInfo.city}
                                            onChange={(e) => (
                                                setShippingInfo({...shippingInfo, city: e.target.value})
                                            )} />
                                            <input className="mb-1" type="text" name="address-street" placeholder="Street"
                                            value={shippingInfo.street}
                                            onChange={(e) => (
                                                setShippingInfo({...shippingInfo, street: e.target.value})
                                            )} />
                                        </div>
                                        )}
                                    </div>
                                    <div id="pick-up-at-convenience-store" className="mb-3">
                                        <label
                                            style={{ color: selectedForm !== "pick-up-at-convenience-store" ? "#9E9E9E" : ""}}>
                                            {selectedForm === "pick-up-at-convenience-store" ? (
                                                <RadioButtonCheckedIcon
                                                className="me-1" style={{fontSize: "1rem", color: "#6C6A61"}}></RadioButtonCheckedIcon>
                                            ) : (
                                                <RadioButtonUncheckedIcon
                                                className="me-1" style={{fontSize: "1rem", color: "#6C6A61"}}></RadioButtonUncheckedIcon>
                                            )}
                                            <input
                                            className="me-1"
                                            type="radio"
                                            name="shippingMethod"
                                            value={"pick-up-at-convenience-store"}
                                            onChange={(e) => setSelectedForm(e.target.value)} />
                                            Convenience Store Pick-Up
                                        </label>
                                        {selectedForm === "pick-up-at-convenience-store" && (
                                        <div id="convenience-store-info" className={`d-flex flex-column ${selectedForm === "pick-up-at-convenience-store" ? "fade-slide" : ""}`}>
                                            <input className="mb-1" type="text" name="convenience-store-id" placeholder="Store ID" />
                                            <input className="mb-1" type="text" name="convenience-store-name" placeholder="Store Name" />
                                        </div>
                                        )}
                                    </div>
                                    <div id="pick-up-at-branch" className="mb-3">
                                        <label
                                            style={{ color: selectedForm !== "pick-up-at-branch" ? "#9E9E9E" : ""}}>
                                            {selectedForm === "pick-up-at-branch" ? (
                                                <RadioButtonCheckedIcon
                                                className="me-1" style={{fontSize: "1rem", color: "#6C6A61"}}></RadioButtonCheckedIcon>
                                            ) : (
                                                <RadioButtonUncheckedIcon
                                                className="me-1" style={{fontSize: "1rem", color: "#6C6A61"}}></RadioButtonUncheckedIcon>
                                            )}
                                            <input
                                            className="me-1"
                                            type="radio"
                                            name="shippingMethod"
                                            value={"pick-up-at-branch"}
                                            onChange={(e) => setSelectedForm(e.target.value)} />
                                            Branch Pick-Up
                                        </label>
                                        {selectedForm === "pick-up-at-branch" && (
                                        <div id="branch-info" className={`d-flex flex-column ${selectedForm === "pick-up-at-branch" ? "fade-slide" : ""}`}>
                                            <input className="mb-1" type="text" name="branch-id" placeholder="Branch ID" />
                                            <input className="mb-1" type="text" name="branch-name" placeholder="Branch Name" />
                                        </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* new section after this */}
                    <div id="recipient" className="mb-3">
                        <div className="container">
                            <div className="row justify-content-center">
                                <div id="recipient-info" className="d-flex flex-column col-10 col-sm-10 col-md-6 section-background">
                                    <div className="mb-1">Recipient Information:</div>
                                    <input className="mb-1" type="text" id="recipient-name" placeholder="Name" value={shippingInfo.recipientName}
                                    onChange={(e) => {
                                        setShippingInfo({...shippingInfo, recipientName: e.target.value})
                                    }} />
                                    <input className="mb-1" type="text" id="recipient-phone" placeholder="Phone Number" value={shippingInfo.recipientPhone}
                                    onChange={(e) => {
                                        setShippingInfo({...shippingInfo, recipientPhone: e.target.value})
                                    }} />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* new section after this */}
                    <div id="confirm" className="mb-3">
                        <div className="container">
                            <div className="row justify-content-center">
                                <div id="confirm-info" className="d-flex flex-column col-10 col-sm-10 col-md-6">
                                    <button type="button" id="back-to-cart-button" className="mb-2" onClick={() => navigate("/cart")}>Back To Cart</button>
                                    <button type="submit" id="confirm-button">Confirm</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <Footer></Footer>
        </div>
        </>
    )
}

export default CheckOut;