interface Props {
    collectionHeading: string,
    collectionSubHeading: string,
    secondCollectionHeading: string,
    secondCollectionSubHeading: string,
}

function Collection({collectionHeading, collectionSubHeading, secondCollectionHeading, secondCollectionSubHeading} : Props) {

    return (
        <>
        <div className="container-fluid new-collection">
            <div className="collection-up">
                <div className="heading">
                    <div className="collection-heading col-12 text-center mb-3">{collectionHeading}</div>
                    <div className="collection-subHeading col-12 text-center mb-5 px-2">{collectionSubHeading}</div>
                </div>
                <div className="product-wrapper d-flex justify-content-center">
                    <div className="product-demo d-flex flex-wrap flex-lg-nowrap text-center justify-content-evenly">
                        <div className="demo-card d-flex flex-column col-12 col-lg-4 position-relative" id="demo1">
                            <img className="mx-auto" src="/Rectangle-4-new-collection-1.png" alt="product-demo1" />
                            <div className="product-name-card py-2 mx-auto position-absolute bottom-0 start-50 translate-middle">CONFIDENCE</div>
                        </div>
                        <div className="demo-card d-flex flex-column col-12 col-lg-4 position-relative" id="demo2">
                            <img className="mx-auto" src="/Rectangle-4-new-collection-2.png" alt="product-demo1" />
                            <div className="product-name-card py-2 mx-auto position-absolute bottom-0 start-50 translate-middle">UNIQUE</div>
                        </div>
                        <div className="demo-card d-flex flex-column col-12 col-lg-4 position-relative" id="demo3">
                            <img className="mx-auto" src="/Rectangle-4-new-collection-3.png" alt="product-demo1" />
                            <div className="product-name-card py-2 mx-auto position-absolute bottom-0 start-50 translate-middle">CASUAL</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="collection-down container">
                <div className="row flex-column-reverse flex-lg-row justify-content-center align-items-center">
                    <div id="collection-showcase-pic" className="col-10 col-lg-5">
                        {/* 因為 img 預設是 inline，無法使用 margin: auto，故需加上d-block搭配mx-auto */}
                        <img className="img-fluid mx-auto d-block" src="./Rectangle-6-new-collection-4.png" alt="" />
                    </div>
                    <div className="heading text-center col-10 col-lg-5">
                        <div className="second-collection-heading collection-heading">{secondCollectionHeading}</div>
                        <div className="second-collection-subHeading collection-subHeading">{secondCollectionSubHeading}</div>
                    </div>
                </div>
                <div id="collection-figures" className="row justify-content-center justify-content-lg-end me-lg-5 align-items-center text-center">
                    <div className="figure-card col-4 col-lg-3 d-flex flex-column justify-content-center align-items-center" id="founded-year">
                        <div className="figures">2025</div>
                        <div className="description">BrandName Founded</div>
                    </div>
                    <div className="figure-card col-4 col-lg-3 d-flex flex-column justify-content-center align-items-center" id="product-sold">
                        <div className="figures">8800+</div>
                        <div className="description">Product Sold</div>
                    </div>
                    <div className="figure-card col-4 col-lg-3 d-flex flex-column justify-content-center align-items-center" id="best-reviews">
                        <div className="figures">5772+</div>
                        <div className="description">Best Reviews</div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Collection;