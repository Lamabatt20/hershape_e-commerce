import React, { useState, useRef, useEffect } from "react";
import "./ProductDetails.css";
import { useParams, useNavigate } from "react-router-dom";
import Footer from "../Components/Footer";
import API, { addToCart as addToCartAPI } from "../api";

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

  const addBtnRef = useRef(null);

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

  if (loading) return <h2>Loading...</h2>;
  if (!product) return <h2>Product not found</h2>;

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

  
  const mainImage =
    Array.isArray(product.images) && product.images.length > 0
       ? product.images[0].startsWith("/")
                        ? product.images[0]
                        : `/images/${product.images[0]}`
                      : "/placeholder.png"

  const increment = () => {
    if (quantity < product.stock) setQuantity(quantity + 1);
  };
  const decrement = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const addToCart = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const customerId = localStorage.getItem("customerId");

    if (!user || !customerId) {
      setErrorMessage("Please login first");
      navigate("/login", { state: { from: `/product/${id}` } });
      return;
    }

    if (!selectedSize || !selectedColor) {
      setErrorMessage("Please select a size and a color");
      return;
    }

    if (quantity > product.stock) {
      setErrorMessage("Quantity exceeds available stock");
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
            productName: product.name,
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
        alert("Error adding to cart: " + res.error);
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
      alert("Something went wrong");
    }
  };

  return (
    <>
      <div className="product-details-container">
        <div className="image-section">
          <img
            src={process.env.PUBLIC_URL + mainImage}
            alt={product.name}
            className="main-image"
          />
          {flyingStyle && (
            <img
              src={process.env.PUBLIC_URL + mainImage}
              style={flyingStyle}
              alt=""
            />
          )}
        </div>

        <div className="info-section">
          <h1>{product.name}</h1>
          <p className={`status ${product.available === "In stock" ? "in" : "out"}`}>
            {product.available}
          </p>
          <p className="description">{product.description}</p>
          <p className="price">₪{product.price}</p>

          {errorMessage && (
            <div className="alert-message">
              <span className="alert-icon">⚠</span>
              {errorMessage}
            </div>
          )}

          <div className="colors">
            <h4>
              Color:{" "}
              <span style={{ color: selectedColor === "nude" ? "#e0c7a0" : selectedColor }}>
                {selectedColor}
              </span>
            </h4>
            <div className="color-options">
              {availableColors.map((color, index) => (
                <button
                  key={index}
                  className={`color-btn ${selectedColor === color ? "selected" : ""}`}
                  style={{ backgroundColor: color === "nude" ? "#e0c7a0" : color }}
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
              Size: <span>{selectedSize}</span>
            </h4>
            <div className="size-options">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  disabled={!availableSizes.includes(size)}
                  className={`size-btn ${selectedSize === size ? "selected" : ""}`}
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
            <label>Quantity</label>
            <div className="quantity-controls">
              <button onClick={decrement} className="qty-btn" disabled={quantity === 1}>
                -
              </button>
              <span className="qty-number">{quantity}</span>
              {quantity < product.stock ? (
                <button onClick={increment} className="qty-btn">
                  +
                </button>
              ) : (
                <button className="qty-btn warning" disabled title="Reached stock limit">
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
            Add to Cart
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetails;
