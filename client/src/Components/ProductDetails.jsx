import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { addToCart as addToCartAPI, getProductById } from "../api";
import Footer from "../Components/Footer";
import "./ProductDetails.css";
import sizeGuideImg from "../assets/images/guide1.jpeg";

const ProductDetails = ({
  modal = false,
  initialProduct = null,
  initialQuantity = 1,
  initialSize = "",
  initialColor = "",
  onUpdate,
  onClose,
}) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(initialProduct);
  const [loading, setLoading] = useState(!initialProduct);
  const [selectedSize, setSelectedSize] = useState(initialSize);
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [quantity, setQuantity] = useState(initialQuantity);
  const [errorMessage, setErrorMessage] = useState("");
  const [flyingStyle, setFlyingStyle] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [language, setLanguage] = useState("en");

 
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const addBtnRef = useRef(null);

  const colorMap = [
    { name: "nude", hex: "#ecc7b5" },
    { name: "black", hex: "#000000" },
    { name: "beige", hex: "#e0c7a0" },
  ];

 
  const productsWithSizeGuide = [16, 18, 20];

  
  const sizeGuideImages = [sizeGuideImg
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
      setLanguage(localStorage.getItem("language") || "en");
    };
    window.addEventListener("storageLanguageChanged", handleLangChange);
    return () =>
      window.removeEventListener("storageLanguageChanged", handleLangChange);
  }, []);

  
  useEffect(() => {
    if (!product) {
      const fetchProduct = async () => {
        setLoading(true);
        const res = await getProductById(id);
        if (!res.error) setProduct(res);
        else console.error("Error fetching product:", res.error);
        setLoading(false);
      };
      fetchProduct();
    }
  }, [id, product]);

  if (loading)
    return <h2>{language === "en" ? "Loading..." : "جارٍ التحميل..."}</h2>;
  if (!product)
    return (
      <h2>{language === "en" ? "Product not found" : "المنتج غير موجود"}</h2>
    );

  const availableVariants = product.variants || [];
  const availableColors = [
    ...new Set(availableVariants.map((v) => v.color).filter((c) => c)),
  ];
  const availableSizes = selectedColor
    ? [
        ...new Set(
          availableVariants
            .filter((v) => v.color === selectedColor)
            .map((v) => v.size)
        ),
      ]
    : [...new Set(availableVariants.map((v) => v.size))];

  const selectedVariant = availableVariants.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  );

  const currentStock = selectedVariant
    ? selectedVariant.stock
    : selectedColor
    ? availableVariants
        .filter((v) => v.color === selectedColor)
        .reduce((sum, v) => sum + v.stock, 0)
    : availableVariants.reduce((sum, v) => sum + v.stock, 0);

  const images =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images.map((img) =>
          img.startsWith("/") ? img : `/images/${img}`
        )
      : ["/placeholder.png"];
  const mainImage = images[currentImageIndex];

  const increment = () => {
    if (quantity < currentStock) {
      setQuantity(quantity + 1);
      setErrorMessage("");
    } else {
      setErrorMessage(
        language === "en"
          ? "Quantity exceeds available stock"
          : "الكمية تتجاوز المخزون المتوفر"
      );
    }
  };

  const decrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      setErrorMessage("");
    }
  };

  const prevImage = () =>
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const nextImage = () =>
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  const triggerFlyingAnimation = () => {
    if (!addBtnRef.current) return;
    const cartIcon = document.querySelector(".cart-icon");
    if (!cartIcon) return;

    const btnRect = addBtnRef.current.getBoundingClientRect();
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
  };

  const handleAddOrUpdate = async () => {
    if (modal && onUpdate) {
      onUpdate({ size: selectedSize, color: selectedColor, quantity });
      onClose && onClose();
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    const customerId = localStorage.getItem("customerId");

    if (!user || !customerId) {
      setErrorMessage(
        language === "en"
          ? "👋 Please login to add products to your cart"
          : "👋 يرجى تسجيل الدخول لإضافة المنتجات للعربة"
      );
      setTimeout(
        () => {
          navigate("/login", { state: { from: `/product/${id}` } });
        },
        2000
      );
      return;
    }

    if (!selectedSize || !selectedColor) {
      setErrorMessage(
        language === "en"
          ? "Please select a size and a color"
          : "يرجى اختيار المقاس واللون"
      );
      return;
    }

    if (quantity > currentStock) {
      setErrorMessage(
        language === "en"
          ? "Quantity exceeds available stock"
          : "الكمية تتجاوز المخزون المتوفر"
      );
      return;
    }

    try {
      triggerFlyingAnimation();

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

        if (existingIndex >= 0) storedCart[existingIndex].quantity += quantity;
        else
          storedCart.push({
            productId: product.id,
            productName: language === "en" ? product.name : product.name_ar,
            productImage: mainImage,
            productPrice: product.price,
            quantity,
            size: selectedSize,
            color: selectedColor,
          });

        localStorage.setItem("cart", JSON.stringify(storedCart));
        window.dispatchEvent(new Event("storageCartChanged"));
      } else {
        alert(
          (language === "en"
            ? "Error adding to cart: "
            : "خطأ في إضافة المنتج للعربة: ") + res.error
        );
      }
    } catch (err) {
      alert(language === "en" ? "Something went wrong" : "حدث خطأ ما");
    }
  };

  return (
    <>
      <div className={`product-details-container ${modal ? "modal-mode" : ""}`}>
        {modal && onClose && (
          <button className="close-modal" onClick={onClose}>
            ×
          </button>
        )}

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
          <p
            className={`status ${
              product.available?.toLowerCase() === "in stock" ? "in" : "out"
            }`}
          >
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
              {language === "en" ? "Color" : "اللون"}:{" "}
              <span>{selectedColor || ""}</span>
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
                    setSelectedSize("");
                    setErrorMessage("");
                    setQuantity(1);
                  }}
                />
              ))}
            </div>
          </div>

          <div className="sizes">
            <h4
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span>
                {language === "en" ? "Size" : "المقاس"}:{" "}
                <span>{selectedSize}</span>
              </span>

              {productsWithSizeGuide.includes(parseInt(product.id)) && (
                <button
                  className="size-guide-btn"
                  onClick={() => setShowSizeGuide(true)}
                >
                  {language === "en" ? "Size Guide" : "دليل المقاسات"}
                </button>
              )}
            </h4>
            <div className="size-options">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  className={`size-btn ${
                    selectedSize === size ? "selected" : ""
                  }`}
                  onClick={() => {
                    setSelectedSize(size);
                    setErrorMessage("");
                    setQuantity(1);
                  }}
                >
                  {size}
                </button>
              ))}
            </div>

            {selectedSize && selectedVariant && (
              <div className="stock-message">
                {selectedVariant.stock === 0 ? (
                  <p className="sold-out">
                    {language === "en"
                      ? "Sold Out! This size will be restocked soon"
                      : "غير متوفر سيتم توفير هذا المقاس قريبًا"}
                  </p>
                ) : selectedVariant.stock <= 5 ? (
                  <p className="low-stock">
                    {language === "en"
                      ? `Only ${selectedVariant.stock} left in stock! Order soon `
                      : `متبقي ${selectedVariant.stock} فقط بالمخزون! سارع بالطلب`}
                  </p>
                ) : null}
              </div>
            )}
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

              {quantity >= currentStock ? (
                <span
                  className="qty-warning"
                  title={language === "en" ? "Max stock reached" : "وصلت الحد المتاح"}
                  style={{ marginLeft: "8px" }}
                >
                  ⚠
                </span>
              ) : (
                <button
                  onClick={increment}
                  className="qty-btn"
                  disabled={currentStock === 0}
                  title={
                    currentStock === 0
                      ? language === "en"
                        ? "Out of Stock"
                        : "غير متوفر"
                      : ""
                  }
                >
                  +
                </button>
              )}
            </div>
          </div>

          <button
            className="add-to-cart"
            disabled={currentStock === 0}
            onClick={handleAddOrUpdate}
            ref={addBtnRef}
          >
            {modal
              ? language === "en"
                ? "Update"
                : "تحديث"
              : language === "en"
              ? "Add to Cart"
              : "أضف إلى العربة"}
          </button>
        </div>
      </div>

      {showSizeGuide && (
        <div className="size-guide-modal">
          <div className="size-guide-content">
            <button
              className="close-modal"
              onClick={() => setShowSizeGuide(false)}
            >
              ×
            </button>
            <div className="size-guide-images">
              {sizeGuideImages.map((img, i) => (
                <img
                  key={i}
                  src={process.env.PUBLIC_URL + img}
                  alt="Size Guide"
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {!modal && <Footer />}
    </>
  );
};

export default ProductDetails;
