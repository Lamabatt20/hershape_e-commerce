import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../Components/Footer";
import "./EmptyCart.css"; 


import ShopaholicIcon from "../assets/icons/icons8-shopaholic-24.png";
import CartIcon from "../assets/icons/icons8-cart-24 (1).png";

const EmptyCart = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="empty-cart-page">
        <div className="empty-cart-container">
          
          <h2>
            <img
              src={ShopaholicIcon}
              alt="Shopping Icon"
              className="empty-cart-top-icon"
            />{" "}
            Shopping Cart
          </h2>

         
          <img
            src={CartIcon}
            alt="Cart Icon"
            className="empty-cart-bottom-icon"
          />

          <p className="empty-cart-text">Your cart is empty</p>
          <p className="empty-cart-subtext">
            🛍️ Start shopping now and discover fits your body shape perfectly.
          </p>
          <button
            onClick={() => navigate("/shop")}
            className="empty-cart-btn"
          >
            Continue Shopping
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EmptyCart;
