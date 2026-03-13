import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Otp from "./pages/auth/Otp";
import Cart from "./pages/Cart";
import Products from "./pages/Products";
import Checkout from "./pages/Checkout";

import DetailProduct from "./pages/DetailProduct";

import AdminLayout from "./components/layout/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Product from "./pages/admin/Product";
import Discount from "./pages/admin/Discount";
import AccountPage from "./pages/admin/Account";
import Collection from "./pages/admin/Collection";
import Payment from "./pages/admin/Payment";
import CategoryPage from "./pages/admin/Category";   
import BrandPage from "./pages/admin/Brands";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/otp" element={<Otp />} />

        {/* New Product Configurator Page */}
        <Route path="/detailproduct" element={<DetailProduct />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Product />} />
          <Route path="discounts" element={<Discount />} />
          <Route path="accounts" element={<AccountPage />} />
          <Route path="collections" element={<Collection />} />
          <Route path="payment" element={<Payment />} />
           <Route path="categories" element={<CategoryPage />} />
            <Route path="brands" element={<BrandPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
