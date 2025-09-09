import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import type { EmblaOptionsType } from "embla-carousel"; // 用來做型別檢查／提示，optional
import useEmblaCarousel from "embla-carousel-react";
import "../pages/ProductCategory.css";
import axios from "axios";

type Product = {
    picURL: string;
    stars: string;
    productName: string;
    price: string;
    id: string;
    size: string;
    colorHex: string;
    colorName: string;
}

const options: EmblaOptionsType = {
    // 不一定要安裝 EmblaOptionsType 套件，也可將以下內容直接寫在useEmblaCarousel括號內
    loop: true,
    align: 'start',
    slidesToScroll: 1
}

// ⬇️ 預設的embla slide只有數字，需根據自己的slide內容設定每個物件的type，再作為array物件拋入PropType裡的slides
type SlideItem = {
    itemName: string;
    review: string;
    userAvatar: string;
    userName: string;
    userJob: string;
};
type PropType = {
    slides: SlideItem[];
};

type CarouselItem = {
    img_url: string;
}

function ProductCategory() {
    // 捲動後 header添加陰影
    const [hasShadow, setHasShadow] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            setHasShadow(window.scrollY > 0); //如果Y捲動 > 0時會返回true
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll); // 清理事件
    },[])

    const { category } = useParams();
    const [emblaRef, emblaApi] = useEmblaCarousel(options);
    const [sortOption, setSortOption] = useState("name-asc");
    const [carouselImgs, setCarouselImgs] = useState<CarouselItem[]>([])
    const [productList, setProductList] = useState<Product[]>([]);
    // const [isFetched, setIsFetched] = useState(false);

    // 依category請求productList商品的API
    useEffect(() => {
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
              'x-rapidapi-key': import.meta.env.VITE_RAPID_API_KEY,
              'x-rapidapi-host': import.meta.env.VITE_RAPID_API_HOST,
            }
          };

          async function fetchData() {

            const cacheKey = `product_category_${category}`
            const cache = localStorage.getItem(cacheKey);

            if (cache) {
                const {data, timestamp} = JSON.parse(cache);
                const now = Date.now();

                const TEN_DAYS = 10 * 24 * 60 * 60 * 1000;
                if (now - timestamp < TEN_DAYS) {
                    // 快取未過期就將data設為productList
                    setProductList(data);
                    console.log("目前ProductCategpry的productList是使用快取的資料。")
                    return;
                }
            }

            // 沒快取資料 or 快取已過期，則發送請求取得新資料
            try {
                const currentMode = import.meta.env.VITE_CURRENT_MODE;
                console.log(`目前的模式是：${currentMode}`);
                let fetchedProducts = [];
                if (currentMode === "under_development") {
                    const productCardQuantity = 20; //設定需要顯示幾樣商品
                    const response = await fetch(`/mock_data/mockProductCategory_${category}.json`);
                    const data = await response.json();
                    fetchedProducts = data.results.slice(0, productCardQuantity);
                    console.log(`目前ProductCategory的${category} productList是使用mock_data的資料。`)
                } else {
                    const response = await axios.request(options)
                    fetchedProducts = response.data.results;
                    console.log(`目前ProductCategory的${category} productList是使用API取回的新資料。`)
                }
                
                console.log("ProductCategory的fetchedProducts：", fetchedProducts);
                const mappedProducts = fetchedProducts.map((product: any) => ({
                    picURL: product.galleryImages[0].baseUrl,
                    stars: "⭐️⭐️⭐️⭐️⭐️",
                    productName: product.name,
                    price: parseFloat(product.price.value),
                    id: product.defaultArticle.code,
                    size: "M",
                    colorHex: product.articles[0].rgbColor,
                    colorName: product.articles[0].color.text,
                  }))

                setProductList(mappedProducts);
                // 儲存快取 & timestamp
                localStorage.setItem(cacheKey,
                    JSON.stringify({
                        data: mappedProducts,
                        timestamp: Date.now()
                    }))
            } catch (err) {
                console.error("無法取得資料，ERROR為：", err)
            }
          }

          fetchData();
    }, [category])

    // 排序商品
    const getSortedProducts = (): Product[] => {
        const productsCopy = [...productList];

        return productsCopy.sort((a, b) => {
            const priceA = parseFloat(a.price);
            const priceB = parseFloat(b.price);

            switch (sortOption) {
                case "price-asc":
                    return priceA - priceB;
                case "price-desc":
                    return priceB - priceA;
                case "name-asc":
                    return a.productName.localeCompare(b.productName);
                case "name-desc":
                    return b.productName.localeCompare(a.productName);
                default:
                    return 0;
            }
        });
    };
    
    // 依category取得carousel的圖片
    useEffect(() => {
        const fetchCarouselImgs = async () => {
            try {
                const response = await fetch(`/api/category/${category}`);
                const data = await response.json();
                setCarouselImgs(data);
            } catch (err) {
                console.error("Error fetching category carousels:", err)
            }
        }

        fetchCarouselImgs();

    }, [category]);

    return (
        <>
        <Header OptionalStyle={`position-fixed header-optional-class ${hasShadow ? "header-shadow" : ""}`}></Header>
        <div id="product-category" className="pt-5">
            <div id="category-carousel" className="pt-1">
                <div className="container-fluid my-5 position-relative">
                    <div className="category-carousel-viewport" ref={emblaRef}>
                        <div className="category-carousel-container d-flex">
                            {carouselImgs.map((img, index) => (
                                <div className="category-carousel-slide flex-grow-0 flex-shrink-0 w-100" key={index}>
                                    <img className="img-fluid" src={img.img_url} alt="" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 左箭頭 */}
                    <button
                    className="category-carousel-button position-absolute top-50 start-0 translate-middle-y"
                    onClick={() => emblaApi?.scrollPrev()}
                    >
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>

                    {/* 右箭頭 */}
                    <button
                    className="category-carousel-button position-absolute top-50 end-0 translate-middle-y"
                    onClick={() => emblaApi?.scrollNext()}
                    >
                        <i className="fa-solid fa-chevron-right"></i>
                    </button>

                </div>
            </div>
            <div className="container">
                <div className="row">
                    <div id="category-sort" className="d-flex justify-content-start align-items-center mb-3">
                        <div className="me-1">Sort:</div>
                        <select name="category-select" id="category-select"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}>
                            <option className="category-option">--select--</option>
                            <option className="category-option" value="price-asc">Price：Low → High</option>
                            <option className="category-option" value="price-desc">Price：High → Low</option>
                            <option className="category-option" value="name-asc">Name：A → Z</option>
                            <option className="category-option" value="name-desc">Name：Z → A</option>
                        </select>
                    </div>
                    <ProductCard slides={getSortedProducts()}></ProductCard>
                </div>
            </div>
        </div>
        <Footer></Footer>
        </>
    )
}

export default ProductCategory;
