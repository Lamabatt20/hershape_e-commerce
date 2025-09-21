import React, { useState, useRef, useEffect } from "react";

const OrderCard = ({ order }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showUpdated, setShowUpdated] = useState(false);
  const [language, setLanguage] = useState("en");
  const detailsRef = useRef(null);

  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (order.updatedAt && order.updatedAt !== order.createdAt) {
      setShowUpdated(true);
    }
  }, [order.updatedAt, order.createdAt]);

  useEffect(() => {
    const storedLang = localStorage.getItem("language") || "en";
    setLanguage(storedLang);

    const handleLangChange = () => {
      const updatedLang = localStorage.getItem("language") || "en";
      setLanguage(updatedLang);
    };

    window.addEventListener("storageLanguageChanged", handleLangChange);
    return () => {
      window.removeEventListener("storageLanguageChanged", handleLangChange);
    };
  }, []);

  const handleToggleDetails = () => {
    setShowDetails(!showDetails);
    if (!showDetails) setShowUpdated(false);
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
    <div className={`order-card ${order.status === "paid" ? "paid" : ""}`}>
      <div className="order-summary">
        <p>
          <strong>{language === "en" ? "Order ID:" : "رقم الطلب:"}</strong> {order.id}
        </p>
        <div className="order-items-count">
          <p>
            {totalItems} {language === "en" ? "items" : "منتجات"}
          </p>
        </div>
        <p>
          <strong>{language === "en" ? "Date:" : "التاريخ:"}</strong>{" "}
          {new Date(order.createdAt).toLocaleDateString()}
        </p>
        <p>
          <strong>{language === "en" ? "Total:" : "الإجمالي:"}</strong> ₪{order.subtotal}
        </p>
        <p>
          <strong>{language === "en" ? "Status:" : "الحالة:"}</strong> {order.status}
          {showUpdated && (
            <span className="order-updated">
              {language === "en" ? " Updated!" : " تم التحديث!"}
            </span>
          )}
        </p>
        <button onClick={handleToggleDetails}>
          {showDetails
            ? language === "en"
              ? "Hide Details"
              : "إخفاء التفاصيل"
            : language === "en"
            ? "View Details"
            : "عرض التفاصيل"}
        </button>
      </div>

      <div
        className="order-details"
        ref={detailsRef}
        style={{
          maxHeight: showDetails ? detailsRef.current?.scrollHeight : 0,
          overflow: "hidden",
          transition: "max-height 0.3s ease",
        }}
      >
        {order.items
          .slice()
          .sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            if (dateB === dateA) return b.id - a.id;
            return dateB - dateA;
          })
          .map((item) => (
            <div className="product-item" key={item.id}>
              <div className="product-images">
                <img
                  src={getItemImage(item)}
                  alt={language === "en" ? item.product.name : item.product.name_ar || item.product.name}
                  style={{
                    width: 50,
                    height: 50,
                    objectFit: "cover",
                    marginRight: 4,
                  }}
                />
              </div>
              <div className="product-info">
                <p>{language === "en" ? item.product.name : item.product.name_ar || item.product.name}</p>
                <p>{item.variant ? `${item.variant.color}/${item.variant.size}` : `${item.color}/${item.size}`}</p>
                <p>{language === "en" ? "x" : "×"}{item.quantity}</p>
                <p>₪{item.variant ? item.variant.price || item.product.price : item.product.price}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default OrderCard;
