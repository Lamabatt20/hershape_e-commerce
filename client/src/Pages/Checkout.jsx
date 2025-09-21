import React, { useEffect, useState } from "react";
import "./Checkout.css";
import Footer from "../Components/Footer";
import { User, MapPin, CreditCard, ShoppingCart } from "lucide-react";
import { createOrder, updateCustomer } from "../api"; 
import SuccessModal from "./SuccessModal"; 

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [language, setLanguage] = useState("en");
  const [country] = useState("Palestinian Territories");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");
  const [shippingCost, setShippingCost] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setUserEmail(storedUser.email);
      if (storedUser.customer) {
        setFirstName("");
        setLastName("");
        setPhone("");
        setCity("");
        setStreet("");
        setPostalCode("");
      }
    }
  }, []);

  const subtotal = cartItems.reduce(
    (total, item) => total + Number(item.product.price) * item.quantity,
    0
  );

  useEffect(() => {
    if (!city) return;
    const cityLower = city.toLowerCase();

    const westBankCities = [
      "رام الله","ramallah","البيرة","al-bireh","الخليل","hebron",
      "نابلس","nablus","طولكرم","tulkarm","جنين","jenin","بيت لحم","bethlehem",
      "قلقيلية","qalqilya","سلفيت","salfit","أريحا","jericho","طوباس","tubas",
      "دورا","dura","يطا","yatta","بيت جالا","beit jala","بيت ساحور","beit sahour"
    ];
    const jerusalemCities = ["القدس", "jerusalem"];
    const inside48Cities = [
      "حيفا","haifa","عكا","acre","يافا","jaffa","اللد","lod",
      "الرملة","ramla","الناصرة","nazareth","شفاعمرو","shefa-'amr","أم الفحم","umm al-fahm",
      "سخنين","sakhnin","الطيبة","tayibe","رهط","rahat"
    ];

    if (westBankCities.some((c) => cityLower.includes(c))) setShippingCost(20);
    else if (jerusalemCities.some((c) => cityLower.includes(c))) setShippingCost(30);
    else if (inside48Cities.some((c) => cityLower.includes(c))) setShippingCost(70);
    else setShippingCost(0);
  }, [city]);

  const total = subtotal + shippingCost;

  const handlePlaceOrder = async () => {
    if (!phone || !city || !street) {
      setMessage(language === "ar" ? "يرجى تعبئة جميع الحقول المطلوبة" : "Please fill all required fields");
      return;
    }
    if (!user || !user.customer) {
      setMessage(language === "ar" ? "الرجاء تسجيل الدخول أولاً" : "Please login first");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const customerData = { 
        name: `${firstName} ${lastName}`, 
        email: user.email, 
        phone, 
        city, 
        address: street, 
        postal_code: postalCode, 
        country_region: country 
      };
      const updatedCustomer = await updateCustomer(user.customer.id, customerData);

      const orderData = {
        customerId: updatedCustomer.id,
        subtotal,
        shipping: shippingCost,
        total,
        items: cartItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          color: item.color,
          size: item.size
        }))
      };

      const order = await createOrder(orderData);

      if (order.error) setMessage(order.error);
      else {
        localStorage.removeItem("cart");
        setCartItems([]);
        setShowSuccessModal(true); 
      }
    } catch (err) {
      setMessage(err.message || "Error creating order");
    } finally {
      setLoading(false);
    }
  };

  const getItemImage = (item) => {
    if (item.variant?.images?.length > 0) {
      return item.variant.images[0].startsWith("/")
        ? item.variant.images[0]
        : `/images/${item.variant.images[0]}`;
    }

    const colorVariant = item.product.variants?.find(
      (v) => v.color === (item.variant?.color || item.color) && v.images?.length > 0
    );
    if (colorVariant) {
      return colorVariant.images[0].startsWith("/")
        ? colorVariant.images[0]
        : `/images/${colorVariant.images[0]}`;
    }

    if (item.product.images?.length > 0) {
      return item.product.images[0].startsWith("/")
        ? item.product.images[0]
        : `/images/${item.product.images[0]}`;
    }

    return "/placeholder.png";
  };

  return (
    <>
      <div className="checkout-container" dir={language === "ar" ? "rtl" : "ltr"}>
        <div className="checkout-form">
          <div className="checkout-header-card">
            <div className="icon-circle"><ShoppingCart size={28} color="#fcf8f0" /></div>
            <h2>{language === "ar" ? "الدفع الآمن" : "Secure Checkout"}</h2>
            <p>{language === "ar" ? "أكمل طلبك بأمان" : "Complete your order safely and securely"}</p>
          </div>

          <div className="form-section">
            <h3><User size={20} color="#6e3c74" style={{ marginRight: "8px" }} />{language === "ar" ? "المعلومات الشخصية" : "Personal Information"}</h3>
            <div className="row">
              <label>
                <span>{language === "ar" ? "الاسم الأول" : "First Name"}<span className="required">*</span></span>
                <input type="text" placeholder={language === "ar" ? "الاسم الأول" : "First Name"} value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              </label>
              <label>
                <span>{language === "ar" ? "اسم العائلة" : "Last Name"}<span className="required">*</span></span>
                <input type="text" placeholder={language === "ar" ? "اسم العائلة" : "Last Name"} value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </label>
            </div>
            <label>
              <span>{language === "ar" ? "البريد الإلكتروني" : "Email Address"}<span className="required">*</span></span>
              <input type="email" value={userEmail} readOnly />
            </label>
            <label>
              <span>{language === "ar" ? "رقم الهاتف" : "Phone Number"}<span className="required">*</span></span>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </label>
          </div>

          <div className="form-section">
            <h3><MapPin size={20} color="#6e3c74" style={{ marginRight: "8px" }} />{language === "ar" ? "عنوان الشحن" : "Shipping Address"}</h3>
            <label>
              <span>{language === "ar" ? "عنوان الشارع" : "Street Address"}<span className="required">*</span></span>
              <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} placeholder={language === "ar" ? "عنوان الشارع" : "Street Address"} required />
            </label>
            <div className="row">
              <label>
                <span>{language === "ar" ? "المدينة" : "City"}<span className="required">*</span></span>
                <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder={language === "ar" ? "المدينة" : "City"} required />
              </label>
              <label>
                <span>{language === "ar" ? "الرمز البريدي" : "Postal Code"}<span className="required">*</span></span>
                <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder={language === "ar" ? "الرمز البريدي" : "Postal Code"} />
              </label>
            </div>
            <label><span>{language === "ar" ? "الدولة / المنطقة" : "Country / Region"}</span><input type="text" value={country} readOnly /></label>
          </div>

          <div className="form-section payment-method">
            <h3>
              <CreditCard size={20} color="#6e3c74" style={{ marginRight: "8px" }} />
              {language === "ar" ? "طريقة الدفع" : "Payment Method"}
            </h3>
            <div className="row">
              <label>
                <input type="radio" checked readOnly />
                {language === "ar" ? "الدفع عند الاستلام" : "Cash on Delivery"}
              </label>
            </div>
          </div>

          <button className="complete-order-btn" onClick={handlePlaceOrder} disabled={loading}>
            {loading ? (language === "ar" ? "جاري المعالجة..." : "Processing...") : `${language === "ar" ? "إتمام الدفع" : "Pay Securely"} ₪${total}`}
          </button>
          {message && <p style={{ color: "red", marginTop: "10px" }}>{message}</p>}
        </div>

        <div className="order-summary">
          <h3>{language === "ar" ? "ملخص الطلب" : "Order Summary"}</h3>
          {cartItems.map((item) => (
            <div key={item.id} className="summary-item">
              <img
                src={getItemImage(item)}
                alt={language === "ar" ? item.product.name_ar || item.product.name : item.product.name}
              />
              <div className="item-info">
                <p className="item-name">{language === "ar" ? item.product.name_ar || item.product.name : item.product.name}</p>
                <div className="item-details">
                  <span className="product-size">{item.size}</span>
                  <span
                    className="color-circle"
                    style={{ backgroundColor: colorMap.find((c) => c.name === item.color)?.hex || item.color }}
                  ></span>
                  <span className="item-quantity">x{item.quantity}</span>
                </div>
              </div>
              <span className="item-price">₪{item.product.price * item.quantity}</span>
            </div>
          ))}
          <hr />
          <div className="summary-total"><p>{language === "ar" ? "الفرعي" : "Subtotal"}</p><span>₪{subtotal}</span></div>
          <div className="summary-total"><p>{language === "ar" ? "الشحن" : "Shipping"}</p><span>₪{shippingCost}</span></div>
          <div className="summary-total final"><p>{language === "ar" ? "الإجمالي " : "Total"}</p><span>₪{total}</span></div>
        </div>
      </div>

      <Footer />

      {showSuccessModal && (
        <SuccessModal 
          language={language} 
          onClose={() => setShowSuccessModal(false)} 
        />
      )}
    </>
  );
};

export default Checkout;
