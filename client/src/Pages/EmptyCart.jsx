import React from "react";
import { useNavigate } from "react-router-dom";
import "./EmptyCart.css";
import CartIcon from "../assets/icons/icons8-cart-24 (1).png"; 
import ShopaholicIcon from "../assets/icons/icons8-shopaholic-24.png"; 
import Footer from "../Components/Footer";

export default function EmptyCart() {
  const navigate = useNavigate();

  return (
    <>
    <div className="empty-cart-page">
      <div className="empty-cart-container">
        <h2 className="empty-cart-text">
          <img src={CartIcon} alt="Cart Icon" className=".empty-cart-icon" />
          Shopping Cart
        </h2>

        <div className="empty-cart-subtext-wrapper">
          <img
            src={ShopaholicIcon}
            alt="Shopaholic Icon"
            className="small-icon"
          />
          <p className="empty-cart-subtext">
            Your cart is empty
          </p>
        </div>

        <p className="empty-cart-subtext">
          🛍️ Start shopping now and discover fits your body shape perfectly.
        </p>

        <button
          className="empty-cart-btn"
          onClick={() => navigate("/shop")}
        >
          Continue Shopping
        </button>
      </div>
    </div>
    <Footer/>
    </>
  );
}
