import EmblaCarousel from "./EmblaCarousel";

function BestSeller() {

    return (
        <>
        <div className="best-seller container-fluid py-5">
            <div className="row justify-content-lg-end justify-content-center align-items-center mx-0">
                <div className="best-seller-left d-flex flex-column justify-content-around align-items-lg-start align-items-center col-8 col-lg-3 mb-5 mb-lg-0">
                    <div className="heading">Best Seller Product</div>
                    <div className="description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi recusandae pariatur expedita iste suscipit numquam ipsam quod ut voluptatem molestiae.</div>
                    <div id="see-more">
                        <button className="btn btn-primary">SEE MORE</button>
                    </div>
                </div>
                <div className="best-seller-right col-10 col-lg-8">
                    <EmblaCarousel></EmblaCarousel>
                </div>
            </div>
        </div>
        </>
    )
}

export default BestSeller;