import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";
import Footer from "../Components/Footer";
import DeleteIcon from "../assets/icons/icons8-delete-32-removebg-preview.png";
import { getCart, deleteCartItem as deleteCartItemAPI, clearCart as clearCartAPI } from "../api";

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const updateQuantity = (cartId, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedCart = cartItems.map((item) =>
      item.id === cartId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("storageCartChanged"));
  };

  const deleteItem = async (cartId) => {
    const res = await deleteCartItemAPI(cartId);
    if (!res.error) {
      const updatedCart = cartItems.filter((item) => item.id !== cartId);
      setCartItems(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      window.dispatchEvent(new Event("storageCartChanged"));
      if (updatedCart.length === 0) {
        navigate("/empty-cart");
      }
    } else {
      console.error(res.error);
    }
  };

  if (loading) return <h2>Loading...</h2>;

  return (
    <>
      <div className="cart-container">
        <h2>Shopping Cart</h2>
        <div className="cart-content">
          <div className="cart-items">
           {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img
                src={
                  Array.isArray(item.product.images) && item.product.images.length > 0
                   ? item.product.images[0].startsWith("/")
                        ? item.product.images[0]
                        : `/images/${item.product.images[0]}`
                      : "/placeholder.png"
                }
                alt={item.product.name}
              />
              <div className="item-info">
                <p>{item.product.name}</p>
                <p>₪{item.product.price}</p>
                <p className="item-size">
                  {item.size} |{" "}
                  <span
                    className="color-circle"
                    style={{ backgroundColor: item.color === "nude" ? "#e0c7a0" : item.color }}
                  ></span>
                </p>
              </div>
              <div className="quantity-control">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              </div>
              <button className="delete-btn" onClick={() => deleteItem(item.id)}>
                <img src={DeleteIcon} alt="Delete Icon" className="delete-icon" />
              </button>
            </div>
          ))}
          </div>

          <div className="cart-summary">
            <h3>Subtotal</h3>
            <p>₪{subtotal}</p>
            <button onClick={clearCart} className="clear-btn">Clear Cart</button>
            <button 
              className="checkout-btn" 
              onClick={() => navigate("/checkout")}
            >
              Proceed To Checkout
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;
