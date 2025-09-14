import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API, { addToCart as addToCartAPI } from "../api";
import Footer from "../Components/Footer";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [flyingStyle, setFlyingStyle] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [language, setLanguage] = useState("en");

  const addBtnRef = useRef(null);

  const colorMap = [
    { name: "nude", hex: "#ecc7b5" },
    { name: "black", hex: "#000000" },
    { name: "beige", hex: "#e0c7a0" },
  ];

 
  const translateAvailability = (status, lang) => {
  if (lang === "en") return status;

  switch (status.toLowerCase()) {
    case "in stock":
      return "متوفر";
    case "out of stock":
      return "غير متوفر";
    default:
      return status;
  }
};


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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <h2>{language === "en" ? "Loading..." : "جارٍ التحميل..."}</h2>;
  if (!product) return <h2>{language === "en" ? "Product not found" : "المنتج غير موجود"}</h2>;

  const availableSizes = Array.isArray(product.sizes)
    ? product.sizes
    : product.sizes
    ? product.sizes.split(",")
    : [];

  const availableColors = Array.isArray(product.colors)
    ? product.colors
    : product.colors
    ? product.colors.split(",")
    : [];

  const images =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images.map((img) =>
          img.startsWith("/") ? img : `/images/${img}`
        )
      : ["/placeholder.png"];

  const mainImage = images[currentImageIndex];

  const increment = () => {
    if (quantity < product.stock) setQuantity(quantity + 1);
  };
  const decrement = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };
  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const addToCart = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const customerId = localStorage.getItem("customerId");

    if (!user || !customerId) {
      setErrorMessage(language === "en" ? "Please login first" : "يرجى تسجيل الدخول أولاً");
      navigate("/login", { state: { from: `/product/${id}` } });
      return;
    }

    if (!selectedSize || !selectedColor) {
      setErrorMessage(language === "en" ? "Please select a size and a color" : "يرجى اختيار المقاس واللون");
      return;
    }

    if (quantity > product.stock) {
      setErrorMessage(language === "en" ? "Quantity exceeds available stock" : "الكمية تتجاوز المخزون المتوفر");
      return;
    }

    try {
      const res = await addToCartAPI({
        customerId: parseInt(customerId),
        productId: parseInt(product.id),
        quantity: parseInt(quantity),
        color: selectedColor,
        size: selectedSize,
      });

      if (!res.error) {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        const existingIndex = storedCart.findIndex(
          (item) =>
            item.productId === product.id &&
            item.size === selectedSize &&
            item.color === selectedColor
        );

        if (existingIndex >= 0) {
          storedCart[existingIndex].quantity += quantity;
        } else {
          storedCart.push({
            productId: product.id,
            productName: language === "en" ? product.name : product.name_ar,
            productImage: mainImage,
            productPrice: product.price,
            quantity,
            size: selectedSize,
            color: selectedColor,
          });
        }

        localStorage.setItem("cart", JSON.stringify(storedCart));
        window.dispatchEvent(new Event("storageCartChanged"));
      } else {
        alert(
          (language === "en" ? "Error adding to cart: " : "خطأ في إضافة المنتج للعربة: ") + res.error
        );
      }

      const btnRect = addBtnRef.current.getBoundingClientRect();
      const cartIcon = document.querySelector(".cart-icon");
      const cartRect = cartIcon.getBoundingClientRect();

      setFlyingStyle({
        display: "block",
        position: "fixed",
        width: "100px",
        height: "100px",
        top: btnRect.top + "px",
        left: btnRect.left + "px",
        transform: "translate(0,0) scale(1)",
        transition: "transform 1.5s ease-in-out, opacity 1.5s ease-in-out",
        opacity: 1,
        borderRadius: "50%",
        pointerEvents: "none",
        zIndex: 1000,
      });

      setTimeout(() => {
        const deltaX = cartRect.left - btnRect.left;
        const deltaY = cartRect.top - btnRect.top;
        setFlyingStyle((prev) => ({
          ...prev,
          transform: `translate(${deltaX}px, ${deltaY}px) scale(0) rotate(360deg)`,
          opacity: 0,
        }));
      }, 50);

      setTimeout(() => setFlyingStyle(null), 1600);
    } catch (err) {
      alert(language === "en" ? "Something went wrong" : "حدث خطأ ما");
    }
  };

  return (
    <>
      <div className="product-details-container">
        <div className="image-section">
          <button className="arrow left" onClick={prevImage}>
            &#8592;
          </button>
          <img
            src={process.env.PUBLIC_URL + mainImage}
            alt={language === "en" ? product.name : product.name_ar}
            className="main-image"
          />
          <button className="arrow right" onClick={nextImage}>
            &#8594;
          </button>
          {flyingStyle && (
            <img
              src={process.env.PUBLIC_URL + mainImage}
              style={flyingStyle}
              alt=""
            />
          )}
        </div>

        <div className="info-section">
          <h1>{language === "en" ? product.name : product.name_ar}</h1>
          <p className={`status ${product.available.toLowerCase() === "in stock" ? "in" : "out"}`}>
            {translateAvailability(product.available, language)}
          </p>
          <p className="description">
            {language === "en" ? product.description : product.description_ar}
          </p>
          <p className="price">₪{product.price}</p>

          {errorMessage && (
            <div className="alert-message">
              <span className="alert-icon">⚠</span>
              {errorMessage}
            </div>
          )}

          <div className="colors">
            <h4>
              {language === "en" ? "Color" : "اللون"}: <span>{selectedColor || ""}</span>
            </h4>
            <div className="color-options">
              {availableColors.map((color, index) => (
                <button
                  key={index}
                  className={`color-btn ${
                    selectedColor === color ? "selected" : ""
                  }`}
                  style={{
                    backgroundColor:
                      colorMap.find((c) => c.name === color)?.hex || color,
                  }}
                  onClick={() => {
                    setSelectedColor(color);
                    setErrorMessage("");
                  }}
                />
              ))}
            </div>
          </div>

          <div className="sizes">
            <h4>
              {language === "en" ? "Size" : "المقاس"}: <span>{selectedSize}</span>
            </h4>
            <div className="size-options">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  disabled={!availableSizes.includes(size)}
                  className={`size-btn ${
                    selectedSize === size ? "selected" : ""
                  }`}
                  onClick={() => {
                    setSelectedSize(size);
                    setErrorMessage("");
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="quantity">
            <label>{language === "en" ? "Quantity" : "الكمية"}</label>
            <div className="quantity-controls">
              <button
                onClick={decrement}
                className="qty-btn"
                disabled={quantity === 1}
              >
                -
              </button>
              <span className="qty-number">{quantity}</span>
              {quantity < product.stock ? (
                <button onClick={increment} className="qty-btn">
                  +
                </button>
              ) : (
                <button
                  className="qty-btn warning"
                  disabled
                  title={language === "en" ? "Reached stock limit" : "وصلت للحد الأقصى"}
                >
                  ⚠
                </button>
              )}
            </div>
          </div>

          <button
            className="add-to-cart"
            disabled={product.available === "Out of stock"}
            onClick={addToCart}
            ref={addBtnRef}
          >
            {language === "en" ? "Add to Cart" : "أضف إلى العربة"}
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetails;
