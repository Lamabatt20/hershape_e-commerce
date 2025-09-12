import React, { useEffect, useState } from "react";
import { getAllOrders, getCustomers, getProducts } from "../../api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend,
  Cell,
  ResponsiveContainer
} from "recharts";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "./Dashboard.css";

import LogoIcon from "../../assets/images/logo.png";
import HomeIcon from "../../assets/icons/home.png";
import OrdersIcon from "../../assets/icons/orders.png";
import ProductsIcon from "../../assets/icons/products.png";
import CustomersIcon from "../../assets/icons/customers.png";
import NotificationIcon from "../../assets/icons/bell.png";
import ShopIcon from "../../assets/icons/shop.png";
import LogoutIcon from "../../assets/icons/logout.png";
import LinkIcon from "../../assets/icons/link.png";
import DotIcon from "../../assets/icons/Dot 1.png";
import ArrowUpIcon from "../../assets/icons/Arrow up.png";
import LaraImage from "../../assets/images/lara.jpeg";

import { Menu as MenuIcon, X as CloseIcon } from "lucide-react";

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    salesChange: 0,
    ordersChange: 0,
    customersChange: 0,
    productsChange: 0
  });

  const [ordersData, setOrdersData] = useState([]);
  const [ordersFilter, setOrdersFilter] = useState("year");
  const [user, setUser] = useState({ name: "Lara", image: LaraImage });
  const [allOrders, setAllOrders] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showDot, setShowDot] = useState(false);

  // Fetch data
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser)
      setUser({
        name: storedUser.name || "Lara",
        image: storedUser.image || LaraImage
      });

    const fetchData = async () => {
      try {
        const orders = await getAllOrders();
        const customers = await getCustomers();
        const products = await getProducts();

        const totalSales = orders.reduce(
          (acc, order) => acc + (Number(order.subtotal) || 0),
          0
        );
        const totalOrders = orders.length;
        const totalCustomers = customers.length;
        const totalProducts = products.length;

        const salesChange = totalSales ? 10 : 0;
        const ordersChange = totalOrders ? 15 : 0;
        const customersChange = totalCustomers ? 5 : 0;
        const productsChange = totalProducts ? 8 : 0;

        setStats({
          totalSales,
          totalOrders,
          totalCustomers,
          totalProducts,
          salesChange,
          ordersChange,
          customersChange,
          productsChange
        });

        setAllOrders(orders);

        const freshOrders = orders.filter(
          (order) => order.status === "pending"
        );

        setShowDot(freshOrders.length > 0);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || storedUser.role !== "admin") {
      navigate("/login", { replace: true });
    } else {
      setUser({
        name: storedUser.name || "Lara",
        image: storedUser.image || LaraImage
      });
    }
  }, [navigate]);

  const aggregateOrders = (orders, filter) => {
    const now = new Date();

    const filtered = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      if (filter === "day") return orderDate.toDateString() === now.toDateString();
      if (filter === "week") {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return orderDate >= startOfWeek && orderDate <= endOfWeek;
      }
      if (filter === "month")
        return (
          orderDate.getMonth() === now.getMonth() &&
          orderDate.getFullYear() === now.getFullYear()
        );
      if (filter === "year")
        return orderDate.getFullYear() === now.getFullYear();
      return false;
    });

    const grouped = {};
    filtered.forEach((order) => {
      const date = new Date(order.createdAt);
      const key = date.toLocaleDateString();
      grouped[key] = (grouped[key] || 0) + 1;
    });

    return Object.keys(grouped).map((k) => ({ day: k, count: grouped[k] }));
  };

  useEffect(() => {
    setOrdersData(aggregateOrders(allOrders, ordersFilter));
  }, [allOrders, ordersFilter]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("customerId");
    navigate("/login");
  };

  const goToHome = () => navigate("/");

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className={`sidebars ${isSidebarOpen ? "open" : ""}`}>
        <div>
          <div className="logo">
            <img src={LogoIcon} alt="Her Shape" style={{ width: 120 }} />
          </div>
          <ul className="menu">
            <li className={location.pathname === "/dashboard" ? "active" : ""}>
              <Link to="/dashboard" className="menu-link">
                <img src={HomeIcon} alt="Home" className="icon" /> Dashboard
              </Link>
            </li>
            <li className={location.pathname === "/orders" ? "active" : ""}>
              <Link to="/orders" className="menu-link">
                <img src={OrdersIcon} alt="Orders" className="icon" /> Order
                Management
              </Link>
            </li>
            <li className={location.pathname === "/customers" ? "active" : ""}>
              <Link to="/customers" className="menu-link">
                <img src={CustomersIcon} alt="Customers" className="icon" />{" "}
                Customers
              </Link>
            </li>
            <li className={location.pathname === "/products" ? "active" : ""}>
              <Link to="/products" className="menu-link">
                <img src={ProductsIcon} alt="Products" className="icon" />{" "}
                Products
              </Link>
            </li>
          </ul>
        </div>
        <div className="sidebars-footer">
          <div className="user-info">
            <img src={user.image} alt={user.name} className="profile" />
            <p className="name">{user.name}</p>
            <img
              src={LogoutIcon}
              alt="Logout"
              className="logout"
              onClick={handleLogout}
            />
          </div>
          <div
            className="shop-link"
            onClick={goToHome}
            style={{ cursor: "pointer" }}
          >
            <p className="shop">
              <img src={ShopIcon} alt="Shop" className="icon" /> Your Shop
            </p>
            <img src={LinkIcon} alt="Link" className="icon" />
          </div>
        </div>
        <button
          className="close-btn"
          onClick={() => setIsSidebarOpen(false)}
        >
          <CloseIcon size={24} />
        </button>
      </aside>

      {/* Main */}
      <div className="main">
        <header className="header">
          <button
            className="menu-btn"
            onClick={() => setIsSidebarOpen(true)}
          >
            <MenuIcon size={24} />
          </button>
          <h2>Dashboard</h2>
          <div className="header-right">
            <button
              className="icon-btn"
              onClick={() => {
                const newOrders = allOrders.filter(order => order.status === "pending");
                navigate("/orders", { state: { newOrders } });
                setShowDot(false);
              }}
            >
              <img src={NotificationIcon} alt="Notification" />
              {showDot && <img src={DotIcon} alt="Dot" className="dot" />}
            </button>
            <img src={user.image} alt={user.name} className="profile" />
          </div>
        </header>

        <main className="content">
          {/* Cards */}
          <div className="cards">
            <div className="card">
              <h3>Total Sales</h3>
              <div className="card-value">
                <p>₪{stats.totalSales}</p>
                <div className="percentage">
                  <img src={ArrowUpIcon} alt="up" className="arrow-icon" />
                  <span>{stats.salesChange}%</span>
                </div>
              </div>
            </div>
            <div className="card">
              <h3>Total Orders</h3>
              <div className="card-value">
                <p>{stats.totalOrders}</p>
                <div className="percentage">
                  <img src={ArrowUpIcon} alt="up" className="arrow-icon" />
                  <span>{stats.ordersChange}%</span>
                </div>
              </div>
            </div>
            <div className="card">
              <h3>Customers</h3>
              <div className="card-value">
                <p>{stats.totalCustomers}</p>
                <div className="percentage">
                  <img src={ArrowUpIcon} alt="up" className="arrow-icon" />
                  <span>{stats.customersChange}%</span>
                </div>
              </div>
            </div>
            <div className="card">
              <h3>Products</h3>
              <div className="card-value">
                <p>{stats.totalProducts}</p>
                <div className="percentage">
                  <img src={ArrowUpIcon} alt="up" className="arrow-icon" />
                  <span>{stats.productsChange}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="charts">
            <div className="chart">
              <h3>Total Sales</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart
                  data={allOrders.map((o, i) => ({
                    day: i + 1,
                    sales: Number(o.subtotal) || 0
                  }))}
                >
                  <XAxis dataKey="day" stroke="#fcf8f0" />
                  <YAxis stroke="#fcf8f0" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#6e3c74",
                      color: "#fcf8f0"
                    }}
                  />
                  <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#fcf8f0"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="chart">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <h3>Orders</h3>
                <select
                  value={ordersFilter}
                  onChange={(e) => setOrdersFilter(e.target.value)}
                  style={{ padding: "4px", borderRadius: "6px" }}
                >
                  <option value="year">Year</option>
                  <option value="day">Day</option>
                  <option value="week">Week</option>
                  <option value="month">Month</option>
                </select>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={ordersData}>
                  <XAxis dataKey="day" stroke="#fcf8f0" />
                  <YAxis stroke="#fcf8f0" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#6e3c74",
                      color: "#fcf8f0"
                    }}
                  />
                  <Legend wrapperStyle={{ color: "#fcf8f0" }} />
                  <Bar dataKey="count">
                    {ordersData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index % 2 === 0 ? "#fcf8f0" : "#c8a2c8"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
