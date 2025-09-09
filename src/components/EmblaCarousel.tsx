import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { EmblaOptionsType } from 'embla-carousel'
import {
  PrevButton,
  NextButton,
  usePrevNextButtons
} from '../components/EmblaCarouselArrowButtons'
import useEmblaCarousel from 'embla-carousel-react'
import axios from 'axios'

// ⬇️ 預設的embla slide只有數字，需根據自己的slide內容設定每個物件的type，再作為array物件拋入PropType裡的slides
type SlideItem = {
    picURL: string;
    stars: string;
    productName: string;
    price: string;
    id: string;
}
type PropType = {
  options?: EmblaOptionsType
}

const EmblaCarousel: React.FC<PropType> = ({options}) => {
  const navigate = useNavigate();
  const [slides, setSlides] = useState<SlideItem[]>([])
  // ⬇️ 使用這個hook設定：emblaRef掛在要控制的容器上，emblaApi控制切換前一張、下一張
  const [emblaRef, emblaApi] = useEmblaCarousel(options)

  // ⬇️ 使用自訂 hook 設定上一張 / 下一張按鈕的狀態與點擊行為（依據 emblaApi 的當前狀態）
  const {
    prevBtnDisabled,    // true 或 false 是否禁用「上一張」按鈕
    nextBtnDisabled,    // true 或 false 是否禁用「下一張」按鈕
    onPrevButtonClick,  // 點擊上一張執行的function
    onNextButtonClick   // 點擊下一張執行的function
  } = usePrevNextButtons(emblaApi)

  // API: 依目前模式抓取Platzi Fake Store 或 mock_data 的商品資料 (Platzi的圖片有可能失效)
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const currentMode = import.meta.env.VITE_CURRENT_MODE;
        console.log(`目前(BestSeller)的模式是：${currentMode}`);
        let fetchedData = [];
        if (currentMode === "under_development") {
          const response = await fetch("/mock_data/mockProductCategory_sportswear.json");
          const data = await response.json();
          fetchedData = data.results;
        } else {
          const response = await axios.get("https://api.escuelajs.co/api/v1/products/?categorySlug=clothes");
          fetchedData = response.data.results;
        }

        // 轉換 API 資料格式 & 只留前10筆資料
        const mappedProducts = fetchedData.slice(10, 20).map((product: any) => ({
          picURL: product.galleryImages[0].baseUrl,
          stars: "⭐️⭐️⭐️⭐️⭐️", // 假資料，實際可根據評價來計算
          productName: product.name,
          price: `$ ${parseFloat(product.price.value)}`,
          id: product.defaultArticle.code,
          size: "M",
          colorHex: product.articles[0].rgbColor,
          colorName: product.articles[0].color.text,
        }))

        setSlides(mappedProducts)

      } catch (err) {
        console.error("Failed fetching data from mock_data or Platzi Fake Store:", err);
      }
    }
    
    fetchSlides()

  }, [])
  return (
    <section className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((item, index) => (
            <div className="embla__slide" key={index} onClick={() => navigate(`/product/${item.id}`)}>
              <div className='best-seller-slide'>
                  <div className='best-seller-slide-picture'>
                      <div className="picURL">
                        <img className='img-fluid d-block' src={item.picURL} alt="" />
                      </div>
                  </div>
                  <div className='best-seller-slide-description d-flex flex-column justify-content-evenly align-items-start p-2'>
                      <div className="stars">{item.stars}</div>
                      <div className="productName">{item.productName}</div>
                      <div className="price">{item.price}</div>
                  </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="embla__controls">
        <div className="embla__buttons">
            {/* usePrevNextButtons(emblaApi)將被點擊時要執行的function指派給以下的 PrevButton、NextButton*/}
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>
      </div>
    </section>
  )
}

export default EmblaCarousel;
