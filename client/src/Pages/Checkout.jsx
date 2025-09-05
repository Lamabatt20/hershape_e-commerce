import React, { useEffect, useState } from "react";
import "./Checkout.css";
import Footer from "../Components/Footer";
import { User, MapPin, CreditCard,ShoppingCart  } from "lucide-react";


const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [country] = useState("Palestinian Territories");

  useEffect(() => {
  
    const items = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(items);

   
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.email) {
      setUserEmail(user.email);
    }
  }, []);

  const subtotal = cartItems.reduce(
    (total, item) => total + Number(item.product.price) * item.quantity,
    0
  );

  return (
    <>
      <div className="checkout-container">
        <div className="checkout-form">
          <div className="checkout-header-card">
          <div className="icon-circle">
            <ShoppingCart size={28} color="#fcf8f0" />
          </div>
          <h2>Secure Checkout</h2>
          <p>Complete your order safely and securely</p>
        </div>

         
          <div className="form-section">
             <h3>
              <User size={20} color="#6e3c74" style={{ marginRight: "8px" }} />
              Personal Information
            </h3>
            <div className="row">
              <label>
                <span>
                First Name<span className="required">*</span></span>
                <input type="text" placeholder="First Name" required />
              </label>
              <label>
                <span>
                Last Name<span className="required">*</span></span>
                <input type="text" placeholder="Last Name" required />
              </label>
            </div>
            <label>
              <span>
              Email Address<span className="required">*</span></span>
              <input type="email" value={userEmail} readOnly />
            </label>
            <label>
              <span>
              Phone Number<span className="required">*</span></span>
              <input type="tel" placeholder="Phone Number" required />
            </label>
          </div>

         
          <div className="form-section">
            <h3>
              <MapPin size={20} color="#6e3c74" style={{ marginRight: "8px" }} />
              Shipping Address
            </h3>
            <label>
              <span>
              Street Address<span className="required">*</span></span>
              <input type="text" placeholder="Street Address" required />
            </label>
            <label>
              Apartment, Suite, etc. (Optional)
              <input
                type="text"
                placeholder="Apartment, Suite, etc. (Optional)"
              />
            </label>
            <div className="row">
              <label>
                <span>
                City<span className="required">*</span></span>
                <input type="text" placeholder="City" required />
              </label>
              <label>
                <span>
                Postal Code<span className="required">*</span></span>
                <input type="text" placeholder="Postal Code" required />
              </label>
            </div>
            <label>
              
              Country / Region
              <input type="text" value={country} readOnly />
            </label>
          </div>

          
          <div className="form-section">
             <h3>
              <CreditCard size={20} color="#6e3c74" style={{ marginRight: "8px" }} />
              Payment Information
            </h3>
            <label>
              <span>
              Card Number<span className="required">*</span></span>
              <input type="text" placeholder="Card Number" required />
            </label>
            <div className="row">
              <label>
                <span>
                MM/YY<span className="required">*</span></span>
                <input type="text" placeholder="MM/YY" required />
              </label>
              <label>
                <span>
                CVC<span className="required">*</span></span>
                <input type="text" placeholder="CVC" required />
              </label>
            </div>
          </div>

          <button className="complete-order-btn">
            Pay Securely ₪{subtotal}
          </button>
        </div>

        
        <div className="order-summary">
          <h3>Order Summary</h3>
          {cartItems.map((item) => (
            <div key={item.id} className="summary-item">
              <img
                src={process.env.PUBLIC_URL + item.product.image}
                alt={item.product.name}
              />
              <div className="item-info">
                <p className="item-name">{item.product.name}</p>
                <div className="item-details">
                  <span className="product-size">{item.size}</span>
                  <span
                    className="color-circle"
                    style={{
                      backgroundColor:
                        item.color === "nude" ? "#e0c7a0" : item.color,
                    }}
                  ></span>
                  <span className="item-quantity">x{item.quantity}</span>
                </div>
              </div>
              <span className="item-price">
                ₪{item.product.price * item.quantity}
              </span>
            </div>
          ))}
          <hr />
          <div className="summary-total">
            <p>Total</p>
            <span>₪{subtotal}</span>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
