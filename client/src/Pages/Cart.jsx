import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";
import Footer from "../Components/Footer";
import DeleteIcon from "../assets/icons/icons8-delete-32-removebg-preview.png";
import ProductDetails from "../Components/ProductDetails";
import ExpandArrow from "../assets/icons/icons8-expand-arrow-24.png";
import {
  getCart,
  deleteCartItem as deleteCartItemAPI,
  clearCart as clearCartAPI,
  updateCartItem as updateCartItemAPI,
} from "../api";

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState("en");
  const [modalProduct, setModalProduct] = useState(null);

  const colorMap = [
    { name: "nude", hex: "#ecc7b5" },
    { name: "black", hex: "#000000" },
    { name: "beige", hex: "#e0c7a0" },
  ];

  const translations = {
    en: {
      shoppingCart: "Shopping Cart",
      subtotal: "Subtotal",
      clearCart: "Clear Cart",
      proceedToCheckout: "Proceed To Checkout",
      loading: "Loading...",
      emptyCartRedirect: "Your cart is empty. Redirecting...",
      size: "Size",
      quantity: "Quantity",
      color: "Color",
    },
    ar: {
      shoppingCart: "عربة التسوق",
      subtotal: "المجموع الفرعي",
      clearCart: "تفريغ العربة",
      proceedToCheckout: "المتابعة للدفع",
      loading: "جارٍ التحميل...",
      emptyCartRedirect: "عربة التسوق فارغة. جاري التحويل...",
      size: "المقاس",
      quantity: "الكمية",
      color: "اللون",
    },
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
    const fetchCart = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.customer?.id) {
        navigate("/login", { state: { from: "/cart" } });
        return;
      }

      try {
        const res = await getCart(user.customer.id);
        if (res.error) {
          console.error(res.error);
          setCartItems([]);
        } else {
          setCartItems(res);
          localStorage.setItem("cart", JSON.stringify(res));
          window.dispatchEvent(new Event("storageCartChanged"));
          if (res.length === 0) {
            navigate("/empty-cart");
          }
        }
      } catch (err) {
        console.error(err);
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [navigate]);

  const subtotal = cartItems.reduce(
    (total, item) => total + Number(item.product.price) * item.quantity,
    0
  );

  const clearCart = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;
    const res = await clearCartAPI(user.customer.id);
    if (!res.error) {
      setCartItems([]);
      localStorage.setItem("cart", JSON.stringify([]));
      window.dispatchEvent(new Event("storageCartChanged"));
      navigate("/empty-cart");
    } else {
      console.error(res.error);
    }
  };

  const updateCartItem = async (updatedItem) => {
    try {
      const res = await updateCartItemAPI(updatedItem.id, updatedItem);
      if (!res.error) {
        const updatedCart = cartItems.map((item) =>
          item.id === updatedItem.id ? { ...item, ...updatedItem } : item
        );
        setCartItems(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        window.dispatchEvent(new Event("storageCartChanged"));
      } else {
        console.error(res.error);
      }
    } catch (err) {
      console.error("Error updating cart item:", err);
    }
  };

  const deleteItem = async (cartId) => {
    const res = await deleteCartItemAPI(cartId);
    if (!res.error) {
      const updatedCart = cartItems.filter((item) => item.id !== cartId);
      setCartItems(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      window.dispatchEvent(new Event("storageCartChanged"));
      if (updatedCart.length === 0) navigate("/empty-cart");
    } else console.error(res.error);
  };

  if (loading) return <h2>{translations[language].loading}</h2>;

  return (
    <>
      <div className="cart-container" dir={language === "ar" ? "rtl" : "ltr"}>
        <h2>{translations[language].shoppingCart}</h2>
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img
                  src={
                    Array.isArray(item.product.images) &&
                    item.product.images.length > 0
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
                  onClick={() => setModalProduct(item)}
                  style={{ cursor: "pointer" }}
                />
                <div className="item-info">
                   <p
                    className="product-name"
                    onClick={() => setModalProduct(item)}
                    style={{ cursor: "pointer" }}
                  >
                    {language === "ar"
                      ? item.product.name_ar || item.product.name
                      : item.product.name}
                  </p>
                  <p>₪{item.product.price}</p>

                  
                 <div
                  className="item-size"
                  onClick={() => setModalProduct(item)}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #ccc",
                    padding: "5px 10px",
                    borderRadius: "12px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <span>{item.size}</span>
                  <span
                    className="color-circle"
                    style={{
                      backgroundColor:
                        colorMap.find((c) => c.name === item.color)?.hex || item.color,
                      width: "15px",
                      height: "15px",
                      borderRadius: "50%",
                      display: "inline-block",
                      border: "1px solid #aaa",
                    }}
                  ></span>
                  <img
                    src={ExpandArrow}
                    alt="Expand"
                    style={{ marginLeft: "auto", width: "16px", height: "16px" }}
                  />
                </div>
                </div>

                <div className="quantity-control">
                  <button
                    onClick={() =>
                      item.quantity > 1 &&
                      updateCartItem({
                        id: item.id,
                        quantity: item.quantity - 1,
                      })
                    }
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateCartItem({
                        id: item.id,
                        quantity: item.quantity + 1,
                      })
                    }
                  >
                    +
                  </button>
                </div>
                <button className="delete-btn" onClick={() => deleteItem(item.id)}>
                  <img src={DeleteIcon} alt="Delete Icon" className="delete-icon" />
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>{translations[language].subtotal}</h3>
            <p>₪{subtotal}</p>
            <button onClick={clearCart} className="clear-btn">
              {translations[language].clearCart}
            </button>
            <button
              className="checkout-btn"
              onClick={() => navigate("/checkout")}
            >
              {translations[language].proceedToCheckout}
            </button>
          </div>
        </div>
      </div>

      {modalProduct && (
        <div className="modal-overlay">
          <ProductDetails
            modal={true}
            initialProduct={{ ...modalProduct.product, ...modalProduct }}
            onUpdate={(updates) => {
              updateCartItem({ id: modalProduct.id, ...updates });
              setModalProduct(null);
            }}
            onClose={() => setModalProduct(null)}
          />
        </div>
      )}

      <Footer />
    </>
  );
};

export default Cart;
