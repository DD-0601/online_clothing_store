// RegisterForm.tsx
import { useState, type ReactHTMLElement } from "react";
import type { ReactFormState } from "react-dom/client";
import { useAuth } from "../contexts/AuthContext";

type Account = {
  email: string,
  password: string,
}
function AuthLogin() {
    const { login } = useAuth();
    const [loginData, setLoginData] = useState<Account>({
      email: "",
      password: "",
    });

    // input輸入資料時，即時變更loginData的資料
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setLoginData({...loginData, [e.target.name]: e.target.value});
    }
    // TODO: 寫登入前後端 & 登入後導向原本要前往的頁面 如：購物車
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if(!loginData.email || !loginData.password) {
        alert("請輸入帳號及密碼。");
        return;
      }

      // 將輸入的帳號、密碼傳至後端
      const response = await fetch("/api/login",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      
      if (response.ok) {
        login(data.token);
        alert("登入成功！");
        console.log("登入成功 ", data.message);
      } else {
        alert("登入失敗：" + data.message );
        console.log("Error: ", data.error);
      }
    }
  return (
    <>
    <div id="auth-login">
      <div className="container">
          <div className="row justify-content-center">
              <form onSubmit={handleSubmit} id="form-login" className="col-10 col-sm-10 col-md-6 my-3">
                  <div id="login" className="form-frame">
                      <div className="row d-flex align-items-center">
                          <span className="col-3">Email</span>
                          <input className="col-8" type="email" name="email" placeholder="email" required
                          onChange={(e) => handleChange(e)} />
                      </div>
                      <div className="row d-flex align-items-center">
                          <span className="col-3">Password</span>
                          <input className="col-8" type="password" name="password" placeholder="password" required
                          onChange={(e) => handleChange(e)} />
                      </div>
                      <button id="login-button">Login</button>
                  </div>
              </form>
          </div>
      </div>
    </div>
    </>
  );
}

export default AuthLogin;
