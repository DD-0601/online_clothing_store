import ReviewCarousel from "./ReviewCarousel";
function Reviews() {
// TODO: 建立要加入review-card的array & 用 滑動的slides
    const userList = [
        {
            itemName: "Denim Bermuda Shorts",
            review: "Comfortable and met all my expectation! I ordered a medium and it fit perfectly !",
            userAvatar: "./users/user1.png",
            userName: "Mario",
            userJob: "Engineer",
        },
        {
            itemName: "Linen-blend shirt",
            review: "Comfortable and met all my expectation! i ordered a medium and it fit perfectly !",
            userAvatar: "./users/user2.png",
            userName: "Luigi",
            userJob: "Engineer",
        },
        {
            itemName: "Sports Skirt with DryMove",
            review: "Comfortable and met all my expectation! i ordered a medium and it fit perfectly !",
            userAvatar: "./users/user3.png",
            userName: "Peach",
            userJob: "Fashion Designer",
        },
        {
            itemName: "Short-Sleeved Shirt",
            review: "Comfortable and met all my expectation! i ordered a medium and it fit perfectly !",
            userAvatar: "./users/user4.png",
            userName: "Toad",
            userJob: "Security",
        },
        {
            itemName: "Loose Fit T-shirt",
            review: "Comfortable and met all my expectation! i ordered a medium and it fit perfectly !",
            userAvatar: "./users/user5.png",
            userName: "Kirby",
            userJob: "Model",
        },
    ]
    return (
        <>
        <div id="reviews">
            <div className="container-fluid">
                <div id="review-up" className="row d-flex flex-column justify-content-center align-items-center text-center">
                    <div id="review-heading" className="col-12 pb-3">What People Say About Us</div>
                    <div id="review-description" className="col-12 pb-5">Horem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum.</div>
                </div>
                <div id="review-down" className="row justify-content-start align-items-center">
                    <ReviewCarousel slides={userList}></ReviewCarousel>
                </div>
            </div>
        </div>
        </>
    )
}

export default Reviews;