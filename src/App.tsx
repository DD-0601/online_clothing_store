// import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import './EmblaCarousel.css'
import Header from './components/Header'
import Hero from './components/Hero'
import Collection from './components/Collection'
import BestSeller from './components/BestSeller'
import OurProduct from './components/OurProduct'
import Deal from './components/Deal'
import Reviews from './components/Reviews'
import FooterCarousel from './components/FooterCarousel'
import Footer from './components/Footer'
// import { useCategories } from './contexts/CategoryContext'
import { AuthProvider } from './contexts/AuthContext'
import { ShoppingCartProvider } from './contexts/ShoppingCartContext.tsx'
// routes:
import ProductCategory from './pages/ProductCategory'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import CheckOut from './pages/CheckOut'
import AuthPage from './pages/AuthPage'
import OrderList from './pages/OrderList'

function HomePage() {
  // const categories = useCategories();

  return (
    <>
    <div className='container-fluid app'>
      <div id='header-and-hero' className='container'>
        <Header></Header>
      <Hero heroHeading='The best fashion style for you' heroMessage='Horem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora.'></Hero>
      </div>
      </div>
      
      <Collection collectionHeading='New Collection' collectionSubHeading='Horem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum.' secondCollectionHeading='Best Fashion Since 2025' secondCollectionSubHeading='Forem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis. ad litora torquent per.'></Collection>
      <BestSeller></BestSeller>
      <OurProduct></OurProduct>
      <Deal></Deal>
      <Reviews></Reviews>
      <FooterCarousel></FooterCarousel>
      <Footer></Footer>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ShoppingCartProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:category" element={<ProductCategory />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />}></Route>
          <Route path="/checkout" element={<CheckOut />}></Route>
          <Route path="/authorize" element={<AuthPage />}></Route>
          <Route path="/orders/" element={<OrderList></OrderList>}></Route>
        </Routes>
        </ShoppingCartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
export default App