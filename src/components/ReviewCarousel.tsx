import React from "react";
import type { EmblaOptionsType } from "embla-carousel"; // 用來做型別檢查／提示，optional
import useEmblaCarousel from "embla-carousel-react";

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

const ReviewCarousel: React.FC<PropType> = ({ slides }) => {
  const [emblaRef] = useEmblaCarousel(options);
  return (
    <>
      <section className="embla col-12" style={{padding: '0'}}>
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container pb-1">
            {slides.map((review, index) => (
              <div
                className="embla__slide review-card col-8 col-sm-6 col-md-4 col-lg-4 col-xl-3 d-flex flex-column justify-content-center align-items-center gap-3 p-4"
                key={index}
                
              >
                <div className="review-item">{review.itemName}</div>
                <div className="review-content p-3 p-sm-0">{review.review}</div>
                <div className="review-user-avatar">
                  <img
                    className="img-fluid"
                    src={review.userAvatar}
                    alt="user-picture"
                  />
                </div>
                <div className="review-user-name">{review.userName}</div>
                <div className="review-user-job">{review.userJob}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ReviewCarousel;
