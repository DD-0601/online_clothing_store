import Header from "../components/Header";
import Footer from "../components/Footer";
import "../pages/OrderList.css";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLocation, Navigate } from "react-router-dom";

type Item = {
    order_item_id: number;
    order_id: number;
    product_id: number;
    product_name: string;
    product_url: string;
    product_price: number;
    quantity: number;
    subtotal: number;
};

type Order = {
    order_id: number;
    user_id: number;
    status: string;
    total_amount: number;
    recipient_name: string;
    recipient_phone: string;
    shipping_address: string;
    payment_method: string;
    payment_status: string;
    created_at: string;
    updated_at: string;
    items: Item[];
};

function OrderList() {
    const { isLoggedIn, userInfo } = useAuth();
    const id = userInfo?.id;

    const location = useLocation();
    if (!isLoggedIn) {
        return <Navigate to={"/authorize"} state={{from: location}} replace></Navigate>
    }
    const [orders, setOrders] = useState<Order[]>([]);
    useEffect(() => {
        if (!id) return;  // 先檢查是否有id，不然會先跑API發送的部分，此時還沒拿到id，會是undefined，會出錯
        const getOrderLists = async () => {
            try {
                const response = await fetch(`/api/order_items/${id}`, {
                    method: "GET",
                });
                const data = await response.json();
                setOrders(data.fetchedOrders);
                // console.log("從後端取回的orders訂單資料：", orders);
                console.log(data.message);
                
            } catch (err) {
                console.log(err);
            }
        }
        getOrderLists();
    }, [id])
    // 控制訂單card的顯示，用object記錄每個div的order_id來控制true or false
    const [expanded, setExpanded] = useState<{[key: number]:boolean}>({});
    // 搭配setExpanded，prev為前一次的資料，用spread syntax只更新對應的id，並將value改為相反
    const handleExpand = (id: number) => {
        setExpanded(prev => {
            return {
                ...prev,
                [id]: !prev[id]
            }
        });
    }

    return (
        <>
        <div id="order-list-wrapper">
            <Header></Header>
            <div id="order-list">
                <div className="container mt-3 mb-5">
                    <div className="row flex-column justify-content-center align-items-center">
                        {orders.length === 0 ? (
                            <div className="d-flex justify-content-center align-items-center">
                                <div id="no-orders">There are no orders at the moment.</div>
                            </div>
                        ) : (
                            orders.map((order, index) => (
                                <div key={index} className="order-list-card col-10 d-flex flex-column my-3">
                                    <div className="order-info d-flex flex-row" onClick={() => handleExpand(order.order_id)}>
                                        <div className="order-info-left col-6">
                                            <div className="order-info-id">#ID{order.order_id}</div>
                                            <div className="order-info-date">Order Date: {order.updated_at.slice(0, 10)}</div>
                                        </div>
                                        <div className="order-info-right col-6 d-flex justify-content-center align-items-end">
                                            <div className="order-info-total col-12 text-end">Amount:
                                                <span className="order-info-total-amount ms-1 number-font">${order.total_amount}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="item-info-title d-flex">
                                        <div className="tem-info-item col-6 text-center">ITEM</div>
                                        <div className="tem-info-quantity col-2 text-center">QUANTITY</div>
                                        <div className="tem-info-price col-2 text-center">PRICE</div>
                                        <div className="tem-info-subtotal col-2 text-center">SUBTOTAL</div>
                                    </div>
                                    {order.items.map((item, index) => (
                                    <div key={index} className="item-info d-flex flex-column">
                                        {expanded[order.order_id] && (
                                        <div className="all-items d-flex">
                                            <div className="item-name col-6 text-center">{item.product_name}</div>
                                            <div className="item-quantity col-2 text-center">{item.quantity}</div>
                                            <div className="item-price col-2 text-center">${item.product_price}</div>
                                            <div className="item-subtotal col-2 text-center">${item.subtotal}</div>
                                        </div>
                                        )}
                                    </div>))}
                                </div>
                                ))
                        )}
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </div>
        </>
    )
}

export default OrderList;