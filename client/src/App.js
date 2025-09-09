import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar";

import Home from "./Pages/Home";  
import Shop from "./Pages/Shop";  
import Contact from "./Pages/Contact";
import ProductDetails from "./Components/ProductDetails";
import Signup from "./Pages/Signup";
import Verify from "./Pages/Verfiy";
import Login from "./Pages/Login";
import Cart from "./Pages/Cart";
import EmptyCart from "./Pages/EmptyCart";
import Profile from "./Pages/Orders";
import Checkout from "./Pages/Checkout";


import Dashboard from "./Pages/admin/Dashboard";
import Orders from "./Pages/admin/Orders/Orders";
import Products from "./Pages/admin/Products/Products";
import Customers from "./Pages/admin/Customers/Customers";
import OrderDetails from "./Pages/admin/Orders/OrderDetails";
import CustomersDetails from "./Pages/admin/Customers/CustomerDetails";
import ProductsDetails from "./Pages/admin/Products/ProductDetails";
import AddProducts from "./Pages/admin/Products/AddProduct";


function AppContent() {
  const location = useLocation();

  // المسارات التي نريد إخفاء الـ Navbar فيها
  const noNavbarPrefixes = ["/dashboard", "/orders", "/customers", "/products"];

  const hideNavbar = noNavbarPrefixes.some(prefix =>
    location.pathname === prefix || location.pathname.startsWith(prefix + "/")
  );

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/empty-cart" element={<EmptyCart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<OrderDetails />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/customers/:id" element={<CustomersDetails />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductsDetails />} />
        <Route path="/products/add" element={<AddProducts />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
