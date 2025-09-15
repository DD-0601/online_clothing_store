import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import Header from "../components//Header"
import Footer from "../components/Footer"
import axios from "axios"
import type { EmblaOptionsType } from "embla-carousel" // 用來做型別檢查／提示，optional
import useEmblaCarousel from "embla-carousel-react"
import "../pages/ProductDetail.css"
import { DotButton } from "../components/EmblaCarouselDotButton"
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked"
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked"
import { useShoppingCart } from "../contexts/ShoppingCartContext"

const options: EmblaOptionsType = {
    // 不一定要安裝 EmblaOptionsType 套件，也可將以下內容直接寫在useEmblaCarousel括號內
    loop: true,
    align: 'start',
    slidesToScroll: 1
}

// 設定抓取的商品資料類型
interface ProductData {
    code: string;
    name: string;
    colorHex: string;
    colorName: string;
    description: string;
    price: string;
    onSalePrice: string;
    images: string[];
}

function ProductDetail() {
    // 捲動後 header添加陰影
    const [hasShadow, setHasShadow] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            setHasShadow(window.scrollY > 0); //如果Y捲動 > 0時會返回true
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll); // 清理事件
    },[])

    const { dispatch } = useShoppingCart();

    const { id } = useParams();
    const [ product, setProduct ] = useState<ProductData | null>(null);
    const [emblaRef, emblaApi] = useEmblaCarousel(options)
    // 購物車表單資料的hooks
    const [selectedSize, setSelectedSize] = useState<string>("");
    const [shippingMethod, setShippingMethod] = useState<string | null>(null);
    const [quantity, setQuantity] = useState<number>(1);

    // 加入購物車的通知
    const [showNotification, setShowNotification] =useState(false);
    const sizeList = ["XS", "S", "M", "L", "XL"];
    const shippingMethodList = ["to Home", "to Store", "to Branch"];

    // pagination dots設定
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
    useEffect(() => {
        if (!emblaApi) return;

        const onSelect = () => {
            setSelectedIndex(emblaApi.selectedScrollSnap());
        }

        setScrollSnaps(emblaApi.scrollSnapList());
        emblaApi.on("select", onSelect);
        onSelect(); //初始化時也執行一次
    }, [emblaApi]);

    // 抓取商品資料
    useEffect(() => {
        const options = {
            method: 'GET',
            url: 'https://apidojo-hm-hennes-mauritz-v1.p.rapidapi.com/products/detail',
            params: {
            lang: 'en',
            country: 'us',
            productcode: id,
            },
            headers: {
                'x-rapidapi-key': import.meta.env.VITE_RAPID_API_KEY,
                'x-rapidapi-host': import.meta.env.VITE_RAPID_API_HOST,
            }
        };

        async function fetchProduct() {

            // 建立快取專屬的key
            const cacheKey = `product_id_${id}`;
            const cache = localStorage.getItem(cacheKey);

            if (cache) {
                const {data, timestamp} = JSON.parse(cache);
                const TEN_DAYS = 10 * 24 * 60 * 60 * 1000;
                const now = Date.now();

                // 快取未過期就用data設定product
                if (now - timestamp < TEN_DAYS) {
                    setProduct(data);
                    console.log(`目前product id：${id}的商品，是使用快取資料。`)
                    return; //return 不執行後續發送請求的code
                }
            }

            try {
                const response = await axios.request(options);
                const product = response.data;
                const matchingItem = product.product.articlesList.find((item: any) => item.code === id); // articlesList裡的項目，對應code預覽圖的照片不一定是第一個，故要先比對id，找出對應的照片
                const gallery = matchingItem.galleryDetails as { baseUrl: string }[];
                const productData = {
                    code: product.product.code,
                    name: product.product.name,
                    colorHex: product.product.color.rgbColor,
                    colorName: product.product.color.text,
                    description: product.product.description,
                    price: product.product.whitePrice.price,
                    onSalePrice: product.product.redPrice?.price ?? "Not On Sale", //有redPrice時才取redPrice.price的值，無則回傳Not On Sale
                    images: gallery.map(img => img.baseUrl)
                }
                // console.log("this is product:", product);
                // console.log("this is productData:",productData);
                setProduct(productData); //更新product的state

                // 儲存快取 & timestamp
                localStorage.setItem(
                    cacheKey,
                    JSON.stringify({
                        data: productData,
                        timestamp: Date.now(),
                    })
                );
            } catch (err) {
                console.error("Failed fetching product details, error: ", err);
            }
        }
        fetchProduct();
    }, [])

    return (
        <>
        <Header OptionalStyle={`position-fixed header-optional-class ${hasShadow ? "header-shadow" : ""}`}></Header>
        {product && ( //加條件判斷讓TypeScript 知道：只有在 product !== null 去渲染product.name product.img等等，因為一開始API還沒抓資料時時空值，會報錯。
        <div id="product-detail">
            <div id="cart-content" className="container mb-5">
            {showNotification && (
            // 加入購物車的通知
            <div className="cart-notification">
                商品已加入購物車
            </div>
            )}
                <div className="row">
                    <div className="product-images col-12 col-md-7">
                        <section className="product-detail-embla col-12">
                            <div className="product-detail-embla__viewport" ref={emblaRef}>
                            <div className="product-detail-embla__container">
                                {product.images.map((img, index) => (
                                <div className="product-detail-embla__slide d-flex justify-content-center" key={index}>
                                    <img className="img-fluid product-detail-img" src={img} alt={product.name} />
                                </div>
                                ))}
                            </div>
                            <div className="embla__dots">
                                {scrollSnaps.map((_, index) => (
                                    <DotButton
                                    key={index}
                                    selected={index === selectedIndex}
                                    onClick={() => emblaApi?.scrollTo(index)}
                                    />
                                ))}
                            </div>
                            </div>
                        </section>
                    </div>
                    <div className="product-details col-12 col-md-5 d-flex flex-column justify-content-around">
                        <div className="product-detail-name my-3 my-md-0">{product.name}</div>
                        <div className="product-detail-size">
                            <span>SIZE:</span>
                            <ul className="d-flex justify-content-between align-items-center text-center">
                                {sizeList.map((size, index) => (
                                    <li
                                        key={index}
                                        className={selectedSize === size ? "selected" : ""}
                                        onClick={() => setSelectedSize(size)}
                                        >
                                            {size}
                                        </li>
                                ))}
                            </ul>
                        </div>
                        <div className="product-detail-shipping-method my-3 my-md-0">
                        <span id="delivery-method">Delivery:</span>
                        <div className="product-detail-shipping-method-group d-flex justify-content-between">
                            {shippingMethodList.map((method, index) => (
                                <div key={index} className="product-detail-shipping-method-group-item">
                                    <label className={`d-flex align-items-center gap-1 shipping-option ${shippingMethod === method ? "shipping-option-active" : ""}`}>
                                    <input
                                        type="radio"
                                        name="shipping"
                                        value={method}
                                        checked={shippingMethod === method}
                                        onChange={(e) => setShippingMethod(e.target.value)}
                                    />
                                    {
                                    shippingMethod === method ?
                                    ( <RadioButtonCheckedIcon style={{ fontSize: "1rem", color: "#6C6A61"}}/> ) :
                                    ( <RadioButtonUncheckedIcon style={{ fontSize: "1rem", color: "#6C6A61"}} />)
                                    }
                                    {method}
                                    </label>
                                </div>
                            ))}
                        </div>
                        </div>
                        <div id="product-detail-price-and-qty" className="d-flex flex-md-column justify-content-between align-items-center align-items-md-start my-3 my-md-0">
                            <div className="product-detail-price mb-md-3">{`$${product.price}`}</div>
                            <div className="product-detail-qty d-flex justify-content-center align-items-center">
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                                <i className="fa-solid fa-minus" style={quantity === 1 ? { color: "#D3D3D3"} : { color: "#140005"}}></i>
                                </button>
                                <span>{quantity}</span>
                                <button onClick={() => setQuantity( q => q + 1)}>
                                    <i className="fa-solid fa-plus" style={{color: "#140005"}}></i>
                                </button>
                            </div>
                        </div>
                        <div className="product-detail-add-cart d-flex justify-content-center align-items-center my-5 my-md-0">
                            <button id="add-cart-button" onClick={() => {
                                if (!selectedSize) {
                                    alert("請先選擇尺寸");
                                    return;
                                }
                                dispatch({
                                    type: "ADD_ITEM",
                                    payload: {
                                        id: `${product.code}_${selectedSize}`,
                                        name: product.name,
                                        price: parseFloat(product.price),
                                        size: selectedSize,
                                        colorHex: product.colorHex,
                                        colorName: product.colorName,
                                        quantity: quantity,
                                        picURL: product.images[0],
                                    }
                                });
                                // 顯示通知
                                setShowNotification(true);
                                // 2秒後自動隱藏
                                setTimeout(() => setShowNotification(false), 2000);

                                // console.log("顏色NAME是：", product.colorName);
                                // console.log("顏色HEX是：", product.colorHex);
                                // console.log("尺寸是：", selectedSize);
                                }
                            }>ADD to CART</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        )}
        <Footer></Footer>
        </>
    )
}

export default ProductDetail;