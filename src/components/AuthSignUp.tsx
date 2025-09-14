import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

type Member = {
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
    phone: string;
    zipCode: string;
    city: string;
    street: string;
}

function AuthSignUp() {
    const { login } = useAuth();

    const [formData, setFormData] = useState<Member>({
        email: "",
        password:  "",
        confirmPassword: "",
        name:  "",
        phone:  "",
        zipCode:  "",
        city:  "",
        street:  "",
    });
    // input輸入資料時，即時變更formData的資料
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    };

    // 送出formData時的API
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("密碼 與 確認密碼 不符");
            return;
        }

        // 此處的/api 是proxy的http://localhost:3001，用env取代/api，部署至Render時會用環境變數換成後端URL
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        let data: any = null;
        try {
            // 嘗試 parse JSON，確認後端回傳的資料是否會為JSON
            data = await response.json();
        } catch (err) {
            console.log("Response is not valid JSON:", err)
        }

        if (response.ok) {
            alert("註冊成功！");
            login(data.token);
            console.log("後端傳回的JWT token：", );
        } else {
            alert(
                 // alert 只接受一個參數，故用加號連接message
                "註冊失敗：" + ((data?.message || "") + (data?.error || "") || `狀態碼：${response.status}`)
            ); // 先拼接好訊息，如果結果是空字串才 fallback 到 狀態碼
        }
    };

    return (
        <>
        <div id="auth-sign-up">
            <div className="container">
                <div className="row justify-content-center">
                    <form onSubmit={handleSubmit} id="form-sign-up" className="col-10 col-sm-10 col-md-6 my-3">
                        <div id="sign-up" className="form-frame">
                            <div className="row d-flex align-items-center">
                                <span className="col-3">Email</span>
                                <input className="col-8" type="email" name="email" placeholder="email" required
                                value={formData.email}
                                onChange={handleChange} />
                            </div>
                            <div className="row d-flex align-items-center">
                                <span className="col-3">Password</span>
                                <input className="col-8" type="password"
                                name="password" placeholder="password" required
                                value={formData.password}
                                onChange={handleChange} />
                            </div>
                            <div className="row d-flex align-items-center">
                                <span className="col-3">Confirm Password</span>
                                <input className="col-8" type="password"
                                name="confirmPassword" placeholder="confirm password" required
                                value={formData.confirmPassword}
                                onChange={handleChange} />
                            </div>
                            <div className="row d-flex align-items-center">
                                <span className="col-3">Name</span>
                                <input className="col-8" type="text"
                                name="name" placeholder="Name" required
                                value={formData.name}
                                onChange={handleChange} />
                            </div>
                            <div className="row d-flex align-items-center">
                                <span className="col-3">Phone</span>
                                <input className="col-8" type="text"
                                name="phone" placeholder="09XX123456" required
                                value={formData.phone}
                                onChange={handleChange} />
                            </div>
                            <div className="row d-flex align-items-center">
                                <span className="col-3">Zip-Code</span>
                                <input className="col-8" type="text"
                                name="zipCode" placeholder="XX-XXX" required
                                value={formData.zipCode}
                                onChange={handleChange} />
                            </div>
                            <div className="row d-flex align-items-center">
                                <span className="col-3">City</span>
                                <input className="col-8" type="text"
                                name="city" placeholder="Taipei" required
                                value={formData.city}
                                onChange={handleChange} />
                            </div>
                            <div className="row d-flex align-items-center">
                                <span className="col-3">Street</span>
                                <input className="col-8" type="text"
                                name="street" placeholder="Main St. No.10" required
                                value={formData.street}
                                onChange={handleChange} />
                            </div>
                            <button type="submit" id="sign-up-button">Sign Up</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        </>
    )
}

export default AuthSignUp;