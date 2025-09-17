import React from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

const SuccessModal = ({ language, onClose }) => {
  const navigate = useNavigate();

  const handleViewOrder = () => {
    navigate("/profile"); 
  };

  const handleContinueShopping = () => {
    navigate("/shop"); 
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="success-icon">
          <span>✔</span>
        </div>
        <h2>{language === "ar" ? "شكراً على طلبك!" : "Thank you for ordering!"}</h2>
        <p>
          {language === "ar"
            ? "تم استلام طلبك بنجاح. يمكنك متابعة التسوق أو عرض الطلب."
            : "Your order has been successfully placed. You can continue shopping or view your order."}
        </p>
        <div className="modal-buttons">
          <button onClick={handleViewOrder}>
            {language === "ar" ? "عرض الطلب" : "View Order"}
          </button>
          <button className="continue" onClick={handleContinueShopping}>
            {language === "ar" ? "متابعة التسوق" : "Continue Shopping"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
