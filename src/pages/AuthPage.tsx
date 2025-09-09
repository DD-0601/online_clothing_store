import { useState } from "react";
import "../pages/AuthPage.css"
import Header from "../components/Header";
import Footer from "../components/Footer";
import AuthSignUp from "../components/AuthSignUp";
import AuthLogin from "../components/AuthLogin";

function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    return (
        <>
        <div id="auth-page-wrapper">
            <Header></Header>
            <div id="auth" className="d-flex flex-column justify-content-start">
                <div id="login-or-register">
                    <div className="container">
                        <div className="row justify-content-center text-center">
                            <h2 id="auth-title" className="col-10 col-sm-10 col-md-6">{isLogin ? "Login" : "Sign Up"}</h2>
                        </div>
                    </div>
                </div>
                {isLogin ? (
                    <AuthLogin></AuthLogin>
                ) : (
                    <AuthSignUp></AuthSignUp>
                )}
                <div id="account-exist" className="mb-5">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div id="account-exist-message" className="col-10 col-sm-10 col-md-6">
                                {isLogin ? (
                                    <div id="no-account">
                                        <div>Don't have an account?</div>
                                        <button onClick={() => setIsLogin(false)}>Sign up</button>
                                    </div>
                                ) : (
                                    <div id="have-account">
                                        <div>Already have an account?</div>
                                        <button onClick={() => setIsLogin(true)}>Log in</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </div>
        </>
    )
}

export default AuthPage;