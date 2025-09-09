import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import { CategoryProvider } from './contexts/CategoryContext.tsx'
// import { AuthProvider } from './contexts/AuthContext.tsx'
// 🌟 AuthProvider 移至App.tsx內，因為AuthProvider內有使用navigate，需要被包在BrowserRouter內才能使用
// 🌟 ShoppingCartProvider 移至App.tsx的AuthProvider內，因為需要接收AuthProvider提供的isLoggedIn與userInfo的值

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <AuthProvider> */}
      {/* <ShoppingCartProvider> */}
        <CategoryProvider>
          <App />
        </CategoryProvider>
      {/* </ShoppingCartProvider> */}
    {/* </AuthProvider> */}
  </StrictMode>,
)
