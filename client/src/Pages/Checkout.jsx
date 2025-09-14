import React, { useEffect, useState } from "react";
import "./Checkout.css";
import Footer from "../Components/Footer";
import { User, MapPin, CreditCard, ShoppingCart } from "lucide-react";

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [language, setLanguage] = useState("en");
  const [country] = useState("Palestinian Territories");
  const [paymentMethod, setPaymentMethod] = useState("cod"); 
  const [city, setCity] = useState("");
  const [shippingCost, setShippingCost] = useState(0);

  const colorMap = [
    { name: "nude", hex: "#ecc7b5" },
    { name: "black", hex: "#000000" },
    { name: "beige", hex: "#e0c7a0" },
  ];

  useEffect(() => {
    const storedLang = localStorage.getItem("language") || "en";
    setLanguage(storedLang);

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


  useEffect(() => {
  if (city) {
    const cityLower = city.toLowerCase();

    
    const westBankCities = [
      "رام الله", "ramallah",
      "الخليل", "hebron",
      "نابلس", "nablus",
      "طولكرم", "tulkarm",
      "جنين", "jenin",
      "بيت لحم", "bethlehem",
      "قلقيلية", "qalqilya",
      "سلفيت", "salfit"
    ];

    
    const jerusalemCities = ["القدس", "jerusalem"];

   
    const inside48Cities = [
      "حيفا", "haifa",
      "عكا", "acre",
      "يافا", "jaffa",
      "اللد", "lod",
      "الناصرة", "nazareth"
    ];

    if (westBankCities.some((c) => cityLower.includes(c))) {
      setShippingCost(20);
    } else if (jerusalemCities.some((c) => cityLower.includes(c))) {
      setShippingCost(30);
    } else if (inside48Cities.some((c) => cityLower.includes(c))) {
      setShippingCost(70);
    } else {
      setShippingCost(0); 
    }
  }
}, [city]);


  const total = subtotal + shippingCost;

  return (
    <>
      <div className="checkout-container" dir={language === "ar" ? "rtl" : "ltr"}>
        <div className="checkout-form">
          <div className="checkout-header-card">
            <div className="icon-circle">
              <ShoppingCart size={28} color="#fcf8f0" />
            </div>
            <h2>{language === "ar" ? "الدفع الآمن" : "Secure Checkout"}</h2>
            <p>
              {language === "ar"
                ? "أكمل طلبك بأمان"
                : "Complete your order safely and securely"}
            </p>
          </div>

          {/* Personal Information Section */}
          <div className="form-section">
            <h3>
              <User size={20} color="#6e3c74" style={{ marginRight: "8px" }} />
              {language === "ar" ? "المعلومات الشخصية" : "Personal Information"}
            </h3>
            <div className="row">
              <label>
                <span>
                  {language === "ar" ? "الاسم الأول" : "First Name"}
                  <span className="required">*</span>
                </span>
                <input
                  type="text"
                  placeholder={language === "ar" ? "الاسم الأول" : "First Name"}
                  required
                />
              </label>
              <label>
                <span>
                  {language === "ar" ? "اسم العائلة" : "Last Name"}
                  <span className="required">*</span>
                </span>
                <input
                  type="text"
                  placeholder={language === "ar" ? "اسم العائلة" : "Last Name"}
                  required
                />
              </label>
            </div>
            <label>
              <span>
                {language === "ar" ? "البريد الإلكتروني" : "Email Address"}
                <span className="required">*</span>
              </span>
              <input type="email" value={userEmail} readOnly />
            </label>
            <label>
              <span>
                {language === "ar" ? "رقم الهاتف" : "Phone Number"}
                <span className="required">*</span>
              </span>
              <input
                type="tel"
                placeholder={language === "ar" ? "رقم الهاتف" : "Phone Number"}
                required
              />
            </label>
          </div>

          {/* Shipping Address Section */}
          <div className="form-section">
            <h3>
              <MapPin size={20} color="#6e3c74" style={{ marginRight: "8px" }} />
              {language === "ar" ? "عنوان الشحن" : "Shipping Address"}
            </h3>
            <label>
              <span>
                {language === "ar" ? "عنوان الشارع" : "Street Address"}
                <span className="required">*</span>
              </span>
              <input
                type="text"
                placeholder={language === "ar" ? "عنوان الشارع" : "Street Address"}
                required
              />
            </label>
            <label>
              {language === "ar"
                ? "شقة، جناح، إلخ (اختياري)"
                : "Apartment, Suite, etc. (Optional)"}
              <input
                type="text"
                placeholder={
                  language === "ar"
                    ? "شقة، جناح، إلخ (اختياري)"
                    : "Apartment, Suite, etc. (Optional)"
                }
              />
            </label>
            <div className="row">
              <label>
                <span>
                  {language === "ar" ? "المدينة" : "City"}
                  <span className="required">*</span>
                </span>
                <input
                  type="text"
                  placeholder={language === "ar" ? "المدينة" : "City"}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </label>
              <label>
                <span>
                  {language === "ar" ? "الرمز البريدي" : "Postal Code"}
                  <span className="required">*</span>
                </span>
                <input
                  type="text"
                  placeholder={language === "ar" ? "الرمز البريدي" : "Postal Code"}
                  required
                />
              </label>
            </div>
            <label>
              {language === "ar" ? "الدولة / المنطقة" : "Country / Region"}
              <input type="text" value={country} readOnly />
            </label>
          </div>

          {/* Payment Method Section */}
          <div className="form-section payment-method">
            <h3>
              <CreditCard size={20} color="#6e3c74" style={{ marginRight: "8px" }} />
              {language === "ar" ? "طريقة الدفع" : "Payment Method"}
            </h3>
            <div className="row">
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                {language === "ar" ? "الدفع عند الاستلام" : "Cash on Delivery"}
              </label>
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                {language === "ar" ? "الدفع بالبطاقة" : "Pay by Card"}
              </label>
            </div>
          </div>

          {/* Payment Information Section (only if card is selected) */}
          {paymentMethod === "card" && (
            <div className="form-section">
              <h3>
                {language === "ar" ? "معلومات الدفع" : "Payment Information"}
              </h3>
              <label>
                <span>
                  {language === "ar" ? "رقم البطاقة" : "Card Number"}
                  <span className="required">*</span>
                </span>
                <input
                  type="text"
                  placeholder={language === "ar" ? "رقم البطاقة" : "Card Number"}
                  required
                />
              </label>
              <div className="row">
                <label>
                  <span>
                    {language === "ar" ? "شهر/سنة" : "MM/YY"}
                    <span className="required">*</span>
                  </span>
                  <input
                    type="text"
                    placeholder={language === "ar" ? "شهر/سنة" : "MM/YY"}
                    required
                  />
                </label>
                <label>
                  <span>
                    {language === "ar" ? "CVC" : "CVC"}
                    <span className="required">*</span>
                  </span>
                  <input type="text" placeholder="CVC" required />
                </label>
              </div>
            </div>
          )}

          <button className="complete-order-btn">
            {language === "ar"
              ? `إتمام الدفع ₪${total}`
              : `Pay Securely ₪${total}`}
          </button>
        </div>

        {/* Order Summary */}
        <div className="order-summary">
          <h3>{language === "ar" ? "ملخص الطلب" : "Order Summary"}</h3>
          {cartItems.map((item) => (
            <div key={item.id} className="summary-item">
              <img
                src={
                  Array.isArray(item.product.images) && item.product.images.length > 0
                    ? item.product.images[0].startsWith("/")
                      ? item.product.images[0]
                      : `/images/${item.product.images[0]}`
                    : "/placeholder.png"
                }
                alt={
                  language === "ar"
                    ? item.product.name_ar || item.product.name
                    : item.product.name
                }
              />

              <div className="item-info">
                <p className="item-name">
                  {language === "ar"
                    ? item.product.name_ar || item.product.name
                    : item.product.name}
                </p>
                <div className="item-details">
                  <span className="product-size">{item.size}</span>
                  <span
                    className="color-circle"
                    style={{
                      backgroundColor:
                        colorMap.find((c) => c.name === item.color)?.hex || item.color,
                    }}
                  ></span>
                  <span className="item-quantity">x{item.quantity}</span>
                </div>
              </div>
              <span className="item-price">₪{item.product.price * item.quantity}</span>
            </div>
          ))}
          <hr />
          <div className="summary-total">
            <p>{language === "ar" ? "الإجمالي" : "Total"}</p>
            <span>₪{subtotal}</span>
          </div>
          <div className="summary-total">
            <p>{language === "ar" ? "الشحن" : "Shipping"}</p>
            <span>₪{shippingCost}</span>
          </div>
          <div className="summary-total final">
            <p>{language === "ar" ? "الإجمالي الكلي" : "Grand Total"}</p>
            <span>₪{total}</span>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
