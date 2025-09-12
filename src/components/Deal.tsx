import { useEffect, useState } from "react";

function Deal() {
// 設定剩餘時間的state
// 每一秒用剩餘時間減現在時間得出時差
// 如果時差=0的話，清楚interval&將剩餘時間歸零
// 用時差算出餘數&更新剩餘時間
// 清除interval
// 總倒數 24hours 的state & hook
    const [endTime] = useState(Date.now() + 24 * 60 * 60 * 1000);
    const [timeLeft, setTimeLeft] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0,
    });
    useEffect(() => {
        const timer = setInterval(() => {
            // 檢查localstorage是否已有存好的end_time，有就取來用，避免每次刷新都重新倒數24H
            const saved = localStorage.getItem("end_time");
            let timeDiff;
            if (saved) {
                const savedEndTime = parseInt(saved, 10);
                const now = Date.now();
                timeDiff = savedEndTime - now;
            } else {
                // 沒localstorage時就存一個新的
                localStorage.setItem("end_time", JSON.stringify(endTime))
                const now = Date.now();
                timeDiff = endTime - now;
            }

            // 如果時間差小於 0 的話，清除interval & 將剩餘時間歸零
            if (timeDiff <= 0) {
            // 因為 Date.now() 的精度是毫秒，timeDiff 幾乎不可能剛好等於 0，故用小於 0
                clearInterval(timer);
                setTimeLeft({
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                });
                return;
            }

            // 用時間差算出 時、分、秒的餘數 & 更新剩餘時間
            const hours = Math.floor( (timeDiff / 60 / 60 / 1000 ) % 24);
            const minutes = Math.floor( (timeDiff / 60 / 1000 ) % 60);
            const seconds = Math.floor( (timeDiff / 1000 ) % 60);
            setTimeLeft({hours, minutes, seconds});

        }, 1000);
        return () => clearInterval(timer);
    }, [endTime]);
    return (
        <>
        <div id="deal-of-the-day">
            <div className="container">
                <div className="row mx-auto d-flex justify-content-center p-5">
                    <div id="deal-description" className="col-10 col-lg-5 d-flex flex-column justify-content-center align-items-center align-items-lg-start gap-4 mx-auto">
                        <div id="deal-description-title" className="mb-3 mb-lg-0">
                            Deal Of The Day
                        </div>
                        <div id="deal-description-content" className="mb-3 mb-lg-0">
                        Forem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate.Forem ipsum dolor sit amet.
                        </div>
                        <div id="deal-countdown" className="d-flex gap-3 mb-3 mb-lg-0">
                            <div id="deal-countdown-day" className="deal-countdown-subject d-flex flex-column justify-content-center align-items-center">
                                <div className="number">{timeLeft.hours}</div>
                                <div className="digit">Hours</div>
                            </div>
                            <div id="deal-countdown-hour" className="deal-countdown-subject d-flex flex-column justify-content-center align-items-center">
                                <div className="number">{timeLeft.minutes}</div>
                                <div className="digit">Minutes</div>
                            </div>
                            <div id="deal-countdown-minute" className="deal-countdown-subject d-flex flex-column justify-content-center align-items-center">
                                <div className="number">{timeLeft.seconds}</div>
                                <div className="digit">Seconds</div>
                            </div>
                        </div>
                        <div id="deal-see-more">
                            <button type="button" className="btn btn-primary mb-3 mb-lg-0">SEE MORE</button>
                        </div>
                    </div>
                    <div id="deal-picture" className="col-10 col-lg-5 d-flex justify-content-center align-items-end mx-auto">
                        <img className="img-fluid" src="/Rectangle-23.png" alt="deal-picture" />
                        <div id="deal-picture-filter">
                            <div id="deal-picture-filter-dots"></div>
                            <div id="deal-picture-filter-square"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Deal;