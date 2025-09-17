
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import {getCustomerById} from "../../../api"; 
import "../Orders/Orders.css"; 
import LogoIcon from "../../../assets/images/logo.png";
import HomeIcon from "../../../assets/icons/home.png";
import OrdersIcon from "../../../assets/icons/orders.png";
import ProductsIcon from "../../../assets/icons/products.png";
import CustomersIcon from "../../../assets/icons/customers.png";
import NotificationIcon from "../../../assets/icons/bell.png";
import ShopIcon from "../../../assets/icons/shop.png";
import LaraImage from "../../../assets/images/lara.jpeg";
import LogoutIcon from "../../../assets/icons/logout.png";
import { Menu as MenuIcon, X as CloseIcon } from "lucide-react";

export default function CustomerDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [user, setUser] = useState({ name: "Lara", image: LaraImage });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showDot, setShowDot] = useState(false);

  // Fetch customer
  useEffect(() => {
  const fetchCustomer = async () => {
    try {
      const customerData = await getCustomerById(id);
      setCustomer(customerData);
    } catch (error) {
      console.error("Error fetching customer:", error);
    }
  };
  fetchCustomer();
}, [id]);

  // Protect admin route
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

  if (!customer) return <p style={{ padding: 20 }}>Loading customer details...</p>;

  return (
    <div className="orders-page">
      {/* Sidebar */}
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
            <img src={LogoutIcon} alt="Logout" className="orders-logout" onClick={handleLogout} />
          </div>
          <div className="orders-shop-link" onClick={goToHome} style={{ cursor: "pointer" }}>
            <p className="orders-shop">
              <img src={ShopIcon} alt="Shop" className="icon" /> Your Shop
            </p>
          </div>
        </div>
        <button className="orders-close-btn" onClick={() => setIsSidebarOpen(false)}>
          <CloseIcon size={24} />
        </button>
      </aside>

      {/* Main */}
      <div className="orders-main">
        <header className="orders-header">
          <button className="orders-menu-btn" onClick={() => setIsSidebarOpen(true)}>
            <MenuIcon size={24} />
          </button>
          <h2>Customer Details</h2>
          <div className="orders-header-right">
            <button
                className="orders-icon-btn"
                style={{ position: "relative" }}
                onClick={() => setShowDot(false)}
            >
                <img src={NotificationIcon} alt="Notification" />
                {showDot && (
                <span
                    style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "red",
                    }}
                ></span>
                )}
            </button>
            <img src={user.image} alt={user.name} className="orders-profile" />
            </div>
        </header>

        <main className="customers-content">
          <div className="customers-details-card">
            <h3 style={{ color: "#6e3c74" }}>Customer Id: #{customer.id}</h3>
            <div className="customer-details-form">
              <div className="form-group">
                <label>Customer name</label>
                <input type="text" value={customer.name} readOnly />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="text" value={customer.email} readOnly />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input type="text" value={customer.phone} readOnly />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input type="text" value={customer.address} readOnly />
              </div>
              <div className="form-group">
                <label>Country/Region</label>
                <input type="text" value={customer.country_region} readOnly />
              </div>
              <div className="form-group">
                <label>City</label>
                <input type="text" value={customer.city} readOnly />
              </div>
              <div className="form-group">
                <label>Postal code</label>
                <input type="text" value={customer.postal_code} readOnly />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
