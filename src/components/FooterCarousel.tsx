import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

function FooterCarousel() {

    const [emblaRef] = useEmblaCarousel(
        {
            loop: true,
            align: "start",
            slidesToScroll: 1,
        },
        [Autoplay({
            delay: 3000,         // 每張輪播的時間（ms）
            stopOnInteraction: false, // 使用者互動後是否暫停
            stopOnMouseEnter: true   // 滑鼠移上時是否暫停
        })]
    )

    return (
        <>
        <div id="footer-carousel">
            <div className="container-fluid">
                <div className="row">
                    <div id="footer-picture-display" className="col-12 footer-slide-container d-flex p-0" ref={emblaRef}>
                        <div className="footer-slide-track">
                            <img className="footer-slide-item img-fluid col-4 col-sm-3 col-md-3 col-lg-2" src="./Rectangle-29.png" alt="outfit-display" />
                            <img className="footer-slide-item img-fluid col-4 col-sm-3 col-md-3 col-lg-2" src="./Rectangle-30.png" alt="outfit-display" />
                            <img className="footer-slide-item img-fluid col-4 col-sm-3 col-md-3 col-lg-2" src="./Rectangle-31.png" alt="outfit-display" />
                            <img className="footer-slide-item img-fluid col-4 col-sm-3 col-md-3 col-lg-2" src="./Rectangle-32.png" alt="outfit-display" />
                            <img className="footer-slide-item img-fluid col-4 col-sm-3 col-md-3 col-lg-2" src="./Rectangle-33.png" alt="outfit-display" />
                            <img className="footer-slide-item img-fluid col-4 col-sm-3 col-md-3 col-lg-2" src="./Rectangle-34.png" alt="outfit-display" />
                            <img className="footer-slide-item img-fluid col-4 col-sm-3 col-md-3 col-lg-2" src="./Rectangle-35.png" alt="outfit-display" />
                            <img className="footer-slide-item img-fluid col-4 col-sm-3 col-md-3 col-lg-2" src="./Rectangle-36.png" alt="outfit-display" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default FooterCarousel;