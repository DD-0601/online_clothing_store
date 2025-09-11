interface Props {
    heroHeading: string;
    heroMessage: string;
}

function Hero({heroHeading, heroMessage}: Props) {

    return (
        <>
        <div className="hero-section">
            <div className="container">
                <div className="row flex-column flex-md-row justify-content-center align-items-center">
                    <div className="hero-left col-12 col-md-6 d-flex flex-column text-center align-items-center gap-5 mb-5 mb-md-0">
                        <div id="hero-message">{heroHeading}</div>
                        <div>{heroMessage}</div>
                        <div><button className="btn btn-primary" type="button">SHOP NOW</button></div>
                    </div>
                    <div className="hero-right col-12 col-md-6">
                        <div id="hero-main-picture">
                            <img className="img-fluid mx-auto d-block" src="./Rectangle-3-hero-section-main-picture.png" alt="hero-main-picture" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Hero;