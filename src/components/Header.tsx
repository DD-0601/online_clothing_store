import { useState, useEffect, useRef } from "react";
import { useCategories } from "../contexts/CategoryContext";
import { useShoppingCart } from "../contexts/ShoppingCartContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from 'react-router-dom';

interface Props {
  OptionalStyle?: string; //可選擇要不要加入額外的class
}
function Header({ OptionalStyle }: Props) {

    const navigate = useNavigate();
    const { isLoggedIn, logout, userInfo } = useAuth();

    const categories = useCategories();
    const { totalQuantity } =useShoppingCart();
    const [isMenuOpen, setIsMenuOpen] =useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          // TypeScript 預設不知道 event.target 是哪一種型別，而 .contains()只接受Node 類型的參數，故加上as Node手動告知這一定是 type Node，避免報錯
          if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setIsMenuOpen(false);
          }
        };

          // isMenuOpen 為 true 時：useEffect 執行 → 加上 mousedown 事件監聽器
          if (isMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
          }

          // isMenuOpen 變成 false 或 component 移除時：useEffect 的清理函數 return () => {} 被呼叫 → 移除事件監聽器。不會重複綁定 mousedown & 節省效能
          return () => {
            document.removeEventListener("mousedown", handleClickOutside);
          }
    }, [isMenuOpen]);

    return (
        <>
        <div className={`container-fluid ${OptionalStyle}`}>
            <header className="row align-items-center justify-content-center py-3 mb-4 border-bottom">
                {/* 1 */}
                <div className="d-flex justify-content-around col-12 col-md-3 mb-2 mb-md-0">
                    <a href="/" className="d-flex justify-content-start align-items-center link-body-emphasis text-decoration-none w-50">
                        <img id="logo-pic" className="img-fluid" src="/shoppingbag.png" alt="" />
                        <div id="logo-name">DD's SHOP</div>
                    </a>
                    {/* hamburger menu */}
                    <div id="hamburger-menu" className="d-block d-md-none text-end me-5" ref={menuRef}>
                      <button
                      className=""
                      onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen === false ? "☰" : "X"}
                      </button>
                      
                      {/* dropdown menu */}
                      {isMenuOpen && (
                        <div id="hamburger-dropdown" className="d-md-none">
                          <ul className="nav flex-column text-center">
                            {categories.map((category, index) => (
                              <li key={category.id} className="slide-in-from-left" style={{ animationDelay: `${index * 0.1}s` }}>
                                <a href={`/category/${category.category_id}`}>
                                  {category.name}
                                </a>
                              </li>
                            ))}
                            {isLoggedIn && (
                            <li className="slide-in-from-bottom" style={{ animationDelay: "0.8s" }}><button onClick={() => navigate("/orders")}>Orders</button></li>
                            )}
                            <li className="slide-in-from-bottom" style={{ animationDelay: "0.9s" }}><button onClick={() => navigate("/cart")}>Cart</button></li>
                            {!isLoggedIn ? 
                            <li className="slide-in-from-bottom" style={{ animationDelay: "1s" }}><button onClick={() => navigate("/authorize")}>Login</button></li>
                            : 
                            <li className="slide-in-from-bottom" style={{ animationDelay: "1s" }}><button onClick={() => logout()}>Logout</button></li>
                            }
                          </ul>
                      </div>
                      )}
                    </div>
                </div>
                {/* 1 */}

                
                {/* 2 */}
                {/* 中間選單 只在md以上顯示 */}
                <ul className="nav d-none d-md-flex col-md-6 mb-2 d-flex flex-nowrap justify-content-center mb-md-0">
                    
                    {categories.map((category) => (
                        <li key={category.id}><a href={`/category/${category.category_id}`} className="px-2">{category.name}</a></li>
                    ))}
                    {isLoggedIn && (<li><a href={`/orders`} className="px-2">ORDERS</a></li>)}
                </ul>
                {/* 2 */}

                {/* 3 */}
                <div className="d-none d-md-flex col-md-3 text-center text-md-end d-flex justify-content-center align-items-center">
                  {userInfo?.name && (<div id="user_name" className="text-nowrap fw-bold">Hi, {userInfo.name}</div>)}
                    <a href="/cart" id="header-cart-link">
                    <img className="px-2" src="/shopping-cart_weight_1.png" alt="shopping-cart-icon" />
                    {/* 購物車數字 */}
                    { totalQuantity > 0 && (
                    <div id="header-total-items" className="d-flex justify-content-center align-items-center"><span>{totalQuantity}</span></div>
                    )}
                    </a>
                      {isLoggedIn ?
                          <button type="button" className="btn-custom me-1" onClick={() => logout()}>
                            Logout
                          </button>
                        :
                          <button type="button" className="btn-custom" onClick={() => navigate("/authorize")}>
                            Login
                          </button>
                      }
                </div>
                {/* 3 */}
            </header>

        </div>
        </>
    )
}

export default Header;