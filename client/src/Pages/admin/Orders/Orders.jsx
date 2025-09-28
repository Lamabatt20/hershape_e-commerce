// src/Pages/admin/Orders.jsx
import React, { useEffect, useState } from "react";
import { getAllOrders } from "../../../api";
import { useNavigate, Link, useLocation } from "react-router-dom";
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
import EditIcon from "../../../assets/icons/Icon.png";
import DotIcon from "../../../assets/icons/Dot 1.png";
import SearchIcon from "../../../assets/icons/Icon (6).png";

import { Menu as MenuIcon, X as CloseIcon } from "lucide-react";

export default function Orders() {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState({ name: "Lara", image: LaraImage });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [highlightOrders, setHighlightOrders] = useState([]);

  
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  
  const [searchField, setSearchField] = useState("id");
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showDot, setShowDot] = useState(false);

  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getAllOrders();
        setOrders(res);

        const pendingOrders = res.filter((o) => o.status === "pending");
        setShowDot(pendingOrders.length > 0);

        if (location.state?.newOrders) {
          setHighlightOrders(location.state.newOrders.map((o) => o.id));
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, [location.state]);

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

  // Filter + Search Logic
  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      searchValue === "" ||
      (searchField === "id" &&
        o.id.toString().toLowerCase().includes(searchValue.toLowerCase())) ||
      (searchField === "customer" &&
        o.customer?.name?.toLowerCase().includes(searchValue.toLowerCase()));

    const matchStatus =
      statusFilter === "" || o.status.toLowerCase() === statusFilter.toLowerCase();

    return matchSearch && matchStatus;
  });

  // Pagination
  const indexOfLast = currentPage * ordersPerPage;
  const indexOfFirst = indexOfLast - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

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
            <li className={location.pathname === "/orders" ? "active" : ""}>
              <Link to="/orders" className="orders-menu-link">
                <img src={OrdersIcon} alt="Orders" className="icon" /> Orders
              </Link>
            </li>
            <li className={location.pathname === "/customers" ? "active" : ""}>
              <Link to="/customers" className="orders-menu-link">
                <img src={CustomersIcon} alt="Customers" className="icon" />{" "}
                Customers
              </Link>
            </li>
            <li className={location.pathname === "/products" ? "active" : ""}>
              <Link to="/products" className="orders-menu-link">
                <img src={ProductsIcon} alt="Products" className="icon" />{" "}
                Products
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

      {/* Main */}
      <div className="orders-main">
        <header className="orders-header">
          <button
            className="orders-menu-btn"
            onClick={() => setIsSidebarOpen(true)}
          >
            <MenuIcon size={24} />
          </button>
          <h2>Orders</h2>
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
          {/* Filters */}
          <div className="orders-filters">
            <div className="search-box">
              <select
                value={searchField}
                onChange={(e) => setSearchField(e.target.value)}
              >
                <option value="id">Order ID</option>
                <option value="customer">Customer</option>
              </select>
              <input
                type="text"
                placeholder="Search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <img src={SearchIcon} alt="Search" className="search-icon" />
            </div>

            <div className="status-filter">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          </div>

          
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Status</th>
                <th>Item</th>
                <th>Customer Name</th>
                <th>Subtotal</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((o) => (
                <tr
                  key={o.id}
                  style={{
                    backgroundColor: highlightOrders.includes(o.id)
                      ? "#ffefef"
                      : "transparent",
                  }}
                >
                  <td>{o.id}</td>
                  <td>{o.status}</td>
                  <td>{o.items?.length || 0}</td>
                  <td>{o.customer?.name || "N/A"}</td>
                  <td>₪{o.subtotal}</td>
                  <td>{new Date(o.createdAt).toISOString().split("T")[0]}</td>
                  <td>
                    <button
                    className="orders-edit-btn"
                    onClick={() => navigate(`/orders/${o.id}`)}
                  >
                    <img src={EditIcon} alt="Edit" />
                  </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          
          <div className="orders-pagination">
            <button
              className="page-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              «
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`page-btn ${currentPage === i + 1 ? "active" : ""}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="page-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              »
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
