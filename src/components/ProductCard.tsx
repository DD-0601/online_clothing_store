import { Link } from "react-router-dom";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useShoppingCart } from "../contexts/ShoppingCartContext";
import { useState } from "react";

interface SlideItem {
    picURL: string;
    stars: string;
    productName: string;
    price: string;
    id: string;
    size: string;
    colorHex: string;
    colorName: string;
}

interface Props {
    slides: SlideItem[],
}
function ProductCard({ slides }: Props) {
    const [showNotification, setShowNotification] = useState(false);

    const { dispatch, totalQuantity } = useShoppingCart();
    return (
        <>
        <div className="container-fluid">
        {showNotification && (
            // 加入購物車的通知
            <div className="cart-notification">
                商品已加入購物車
            </div>
        )}
            <div id="product-card-container" className="row mx-1 mx-sm-0 justify-content-center">
                {slides.map((item, index) => {
                    return (
                        <div className="product-card-slide col-6 col-md-4 col-lg-3" key={index}>
                            <Link to={`/product/${item.id}`}className="text-decoration-none">
                            <div className='product-card-slide-picture'>
                                <div className="picURL">
                                <img className='img-fluid d-block product-card-slide-picture-img' src={item.picURL} alt="" />
                                </div>
                            </div>
                            <div className='product-card-slide-description d-flex flex-column justify-content-evenly align-items-center p-2'>
                                <div className="d-flex justify-content-center align-items-center pt-2 pb-1">
                                    <div className="stars">{item.stars}</div>
                                    <button type="button" onClick={(e) => {
                                        e.stopPropagation(); // 阻止事件向上到 Link
                                        e.preventDefault(); // 阻止預設跳轉行為
                                        // 此處不可用INCREMENT_QUANTITY，因cart裡可能尚未有該商品，故用ADD_ITEM才會有完整商品資料
                                        dispatch({type: "ADD_ITEM", payload: {id: `${item.id}-${item.size}`, name: item.productName, price: parseFloat(item.price), quantity: 1, size: item.size, colorHex: item.colorHex, colorName: item.colorName, picURL: item.picURL}})
                                        console.log("數量更新了：", totalQuantity);
                                        console.log("顏色NAME是：", item.colorName);
                                        console.log("顏色HEX是：", item.colorHex);
                                        console.log("尺寸是：", item.size);
                                        console.log("ID是：", item.id);
                                        console.log("價錢是：", item.price);
                                        // 顯示通知
                                        setShowNotification(true);
                                        // 2秒後自動隱藏
                                        setTimeout(() => setShowNotification(false), 2000);
                                        }}>
                                            <AddShoppingCartIcon className=" ms-3 shopping-cart-icon"/>
                                    </button>
                                </div>
                                <div className="productName pb-1">{item.productName}</div>
                                    <div className="price pb-4">{`$${item.price}`}</div>
                            </div>
                            </Link>
                        </div>
                    )
                    
                })}
            </div>
        </div>
        </>
    )
}

export default ProductCard;