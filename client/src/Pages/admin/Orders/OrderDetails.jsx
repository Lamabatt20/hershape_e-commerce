// src/Pages/admin/Orders/OrderDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { getAllOrders, updateOrderStatus } from "../../../api";
import "./Orders.css";

import LogoIcon from "../../../assets/images/logo.png";
import HomeIcon from "../../../assets/icons/home.png";
import OrdersIcon from "../../../assets/icons/orders.png";
import ProductsIcon from "../../../assets/icons/products.png";
import CustomersIcon from "../../../assets/icons/customers.png";
import NotificationIcon from "../../../assets/icons/bell.png";
import ShopIcon from "../../../assets/icons/shop.png";
import LaraImage from "../../../assets/images/lara.jpeg";
import LogoutIcon from "../../../assets/icons/logout.png";
import LinkIcon from "../../../assets/icons/link.png";
import DotIcon from "../../../assets/icons/Dot 1.png";

import EditStatusIcon from "../../../assets/icons/icons8-edit-online-order-48.png";
import CustomerLinkIcon from "../../../assets/icons/icons8-link-48 (1).png";

import { Menu as MenuIcon, X as CloseIcon } from "lucide-react";

export default function OrderDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [user, setUser] = useState({ name: "Lara", image: LaraImage });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showDot, setShowDot] = useState(false);
  const [newStatus, setNewStatus] = useState("");


  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orders = await getAllOrders();
        const foundOrder = orders.find((o) => o.id.toString() === id);
        setOrder(foundOrder);
        setNewStatus(foundOrder?.status || "");

        const pendingOrders = orders.filter((o) => o.status === "pending");
        setShowDot(pendingOrders.length > 0);
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    };
    fetchOrder();
  }, [id]);

 
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || storedUser.role !== "admin") {
      navigate("/login", { replace: true });
    } else {
      setUser({
        name: storedUser.name || "Lara",
        image: storedUser.image || LaraImage,
      });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("customerId");
    navigate("/login");
  };

  const goToHome = () => navigate("/");

  const handleEditClick = () => {
    updateOrderStatus(order.id, newStatus)
      .then((updated) => {
        setOrder((prev) => ({ ...prev, status: newStatus }));
        console.log("Order status updated:", updated);
      })
      .catch((err) => console.error("Error updating:", err));
  };

  if (!order) return <p style={{ padding: 20 }}>Loading order details...</p>;

  return (
    <div className="orders-page">
    
      <aside className={`orders-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div>
          <div className="orders-logo">
            <img src={LogoIcon} alt="Her Shape" style={{ width: 120 }} />
          </div>
          <ul className="orders-menu">
            <li className={location.pathname === "/dashboard" ? "active" : ""}>
              <Link to="/dashboard" className="orders-menu-link">
                <img src={HomeIcon} alt="Home" className="icon" /> Dashboard
              </Link>
            </li>
            <li className={location.pathname.startsWith("/orders") ? "active" : ""}>
              <Link to="/orders" className="orders-menu-link">
                <img src={OrdersIcon} alt="Orders" className="icon" /> Orders
              </Link>
            </li>
            <li className={location.pathname === "/customers" ? "active" : ""}>
              <Link to="/customers" className="orders-menu-link">
                <img src={CustomersIcon} alt="Customers" className="icon" /> Customers
              </Link>
            </li>
            <li className={location.pathname === "/products" ? "active" : ""}>
              <Link to="/products" className="orders-menu-link">
                <img src={ProductsIcon} alt="Products" className="icon" /> Products
              </Link>
            </li>
          </ul>
        </div>
        <div className="orders-sidebar-footer">
          <div className="orders-user-info">
            <img src={user.image} alt={user.name} className="orders-profile" />
            <p className="orders-name">{user.name}</p>
            <img
              src={LogoutIcon}
              alt="Logout"
              className="orders-logout"
              onClick={handleLogout}
            />
          </div>
          <div
            className="orders-shop-link"
            onClick={goToHome}
            style={{ cursor: "pointer" }}
          >
            <p className="orders-shop">
              <img src={ShopIcon} alt="Shop" className="icon" /> Your Shop
            </p>
            <img src={LinkIcon} alt="Link" className="icon" />
          </div>
        </div>
        <button
          className="orders-close-btn"
          onClick={() => setIsSidebarOpen(false)}
        >
          <CloseIcon size={24} />
        </button>
      </aside>

     
      <div className="orders-main">
        <header className="orders-header">
          <button
            className="orders-menu-btn"
            onClick={() => setIsSidebarOpen(true)}
          >
            <MenuIcon size={24} />
          </button>
          <h2>Order Details</h2>
          <div className="orders-header-right">
            <button
              className="orders-icon-btn"
              style={{ position: "relative" }}
              onClick={() => setShowDot(false)}
            >
              <img src={NotificationIcon} alt="Notification" />
              {showDot && (
                <img
                  src={DotIcon}
                  alt="Dot"
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: 6,
                    height: 6,
                  }}
                />
              )}
            </button>

            <img src={user.image} alt={user.name} className="orders-profile" />
          </div>
        </header>

        <main className="orders-content">
          <div className="order-details-card">
            <h3 style={{ color: "#6e3c74" }}>Orders Id: #{order.id}</h3>

            <div className="order-items">
              {order.items?.map((item, i) => (
                <div key={i} className="order-item">
                 <img
                    src={
                      Array.isArray(item.product?.images) && item.product.images.length > 0
                        ? item.product.images[0].startsWith("/")
                          ? item.product.images[0] 
                          : `/images/${item.product.images[0]}` 
                        : "/placeholder.png"
                    }
                    alt={item.product?.name}
                    className="order-product-img"
                  />
                  <div className="order-item-info">
                    <p>{item.product?.name}</p>
                    <p>
                      Color: <span>{item.color}</span> | Size:{" "}
                      <span>{item.size}</span>
                    </p>
                    <p>Qty: {item.quantity}</p>
                  </div>
                  <p className="order-item-price">₪{item.product.price}</p>
                </div>
              ))}
            </div>

            <div className="order-summary">
              <p>Subtotal: ₪{order.subtotal}</p>
              <p>Shipping: ₪{order.shipping}</p>
              <h4>Total: ₪{order.subtotal + order.shipping}</h4>
            </div>

            <div className="order-actions">
              <div className="order-status">
                <label>Order status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="delivered">Delivered</option>
                </select>
                <img
                  src={EditStatusIcon}
                  alt="Update Status"
                  className="icon-btn"
                  onClick={handleEditClick}
                  style={{ cursor: "pointer" }}
                />
              </div>

              <div className="customer-details">
                <label>Customer details</label>
                <img
                  src={CustomerLinkIcon}
                  alt="Customer Details"
                  className="icon-btn"
                  onClick={() => navigate(`/customers/${order.customer?.id}`)}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
