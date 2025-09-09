import { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import { useCategories } from "../contexts/CategoryContext";

function OurProduct() {
    const categories = useCategories();

    const [productList, setProductList] = useState([]);
    const [category, setCategory] = useState('ladies_all');
    // const [isFetched, setIsFetched] =useState(false); // 使用hook管理發送請求

    // 依category請求productList商品的API
    useEffect(() => {
        const options = {
            method: 'GET',
            url: 'https://apidojo-hm-hennes-mauritz-v1.p.rapidapi.com/products/list',
            params: {
                country: 'us',
                lang: 'en',
                currentpage: '2',
                pagesize: '12',
                categories: category,
            },
            headers: {
                'x-rapidapi-key': import.meta.env.VITE_RAPID_API_KEY,
                'x-rapidapi-host': import.meta.env.VITE_RAPID_API_HOST,
            }
        };

        async function fetchData() {

            // 建立每個category專屬的快取key，快取資料才可分別儲存，不會被不同category覆蓋
            const cacheKey = `productList_${category}`;
            const cache = localStorage.getItem(cacheKey); //使用cacheKey取出對應的快取資料(回傳string要parse)，如無資料則返回null

            // 檢查是否已有快取資料
            if (cache) {
                const { data, timestamp } = JSON.parse(cache);
                const now = Date.now();
                
                const TEN_DAYS = 10 * 24 * 60 * 60 * 1000;
                if (now - timestamp < TEN_DAYS) {
                    // 快取未過期，將productList資料設為快取的data
                    setProductList(data);
                    console.log("目前OurProduct的productList是使用快取的資料。")
                    return;
                }
            }

            // 沒快取資料 or 快取已過期，則發送請求取得新資料
            try {
                const productCardQuantity = 12; //設定需要顯示幾樣商品
                const currentMode = import.meta.env.VITE_CURRENT_MODE;
                console.log(`目前的模式是：${currentMode}`);
                let fetchedProducts = [];
                if (currentMode === "under_development") {
                    const response = await fetch(`/mock_data/mockProductCategory_${category}.json`);
                    const data = await response.json();
                    fetchedProducts = data.results.slice(0, productCardQuantity);
                    console.log(`目前OurProduct的${category} productList是使用mock_data的資料。`)
                } else {
                    const response = await axios.request(options);
                    console.log(response.data);
                    fetchedProducts = response.data.results.slice(0, productCardQuantity);
                    console.log(`目前OurProduct的${category} productList是使用API取回的新資料。`)
                }
                const mappedProducts = fetchedProducts.map((product: any) => ({
                    picURL: product.galleryImages[0].baseUrl,
                    stars: "⭐️⭐️⭐️⭐️⭐️",
                    productName: product.name,
                    price: product.price.value,
                    id: product.defaultArticle.code,
                    size: "M",
                    colorHex: product.articles[0].rgbColor,
                    colorName: product.articles[0].color.text,

                }))

                setProductList(mappedProducts);

                // 儲存快取 & timestamp
                localStorage.setItem( // localStorage.setItem(key, value)接受兩個參數,都是string，故要存object時，需先stringify，之後再用parse取出使用
                    cacheKey,
                    JSON.stringify({
                        data: mappedProducts,
                        timestamp: Date.now()
                    })
                );
            } catch (err) {
                console.error("無法取得資料，ERROR為：", err);
            }
        };
        
        fetchData();
    }, [category])
    
    // handle category
    const changeCategory = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const target = e.currentTarget as HTMLElement;
        const value = target.getAttribute("data-value");
        if (value) {
            setCategory(value);
        }
    }
    return (
        <>
        <div id="our-product" className="container-fluid">
            <div id="our-product-nav" className="row justify-content-center align-items-center text-center">
                <div id="our-product-nav-title" className="col-9">Our Product</div>
                <div id="our-product-nav-list" className="col-9">
                    <ul className="d-flex justify-content-center align-items-center gap-3">
                        {categories.map((category) => (
                            <li key={category.id}><a href="#" data-value={category.category_id} onClick={changeCategory}>{category.name}</a></li>
                        ))}
                    </ul>
                </div>
                <div className="our-product-display col-9">
                    <ProductCard slides={productList}></ProductCard>
                </div>
            </div>
        </div>
        </>
    )
}

export default OurProduct;