import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar";

// user pages
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
import OrderDetails from "./Pages/admin/Orders/OrderDetails";
import Customers from "./Pages/admin/Customers/Customers";
import CustomerDetails from "./Pages/admin/Customers/CustomerDetails";
import Products from "./Pages/admin/Products/Products";
import ProductDetailsAdmin from "./Pages/admin/Products/ProductDetails";
import AddProduct from "./Pages/admin/Products/AddProduct";

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
     
      {!isAdminRoute && <Navbar />}

      <Routes>
       
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/siginup" element={<Signup />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/empty-cart" element={<EmptyCart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/checkout" element={<Checkout />} />

       
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/orders" element={<Orders />} />
        <Route path="/admin/orders/:id" element={<OrderDetails />} />
        <Route path="/admin/customers" element={<Customers />} />
        <Route path="/admin/customers/:id" element={<CustomerDetails />} />
        <Route path="/admin/products" element={<Products />} />
        <Route path="/admin/products/:id" element={<ProductDetailsAdmin />} />
        <Route path="/admin/products/add" element={<AddProduct />} />
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



