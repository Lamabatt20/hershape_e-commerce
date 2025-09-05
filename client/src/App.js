import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Home from './Pages/Home';  
import Shop from './Pages/Shop';  
import Contact from './Pages/Contact';
import ProductDetails from './Components/ProductDetails';
import Signup from "./Pages/Signup";
import Verify from "./Pages/Verfiy";
import Login from "./Pages/Login";
import Cart from "./Pages/Cart";
import EmptyCart from "./Pages/EmptyCart";
import Profile from "./Pages/Orders";
import Checkout from "./Pages/Checkout";

 

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/siginup" element={<Signup />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<Cart />}/>
         <Route path="/empty-cart" element={<EmptyCart />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </Router>
  );
}

export default App;
