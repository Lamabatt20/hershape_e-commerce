import DeleteIcon from "../../../assets/icons/icons8-delete-32-removebg-preview.png";
import React, { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "../../../api"; 
import { useNavigate, Link, useLocation } from "react-router-dom";
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
import LinkIcon from "../../../assets/icons/link.png";
import DotIcon from "../../../assets/icons/Dot 1.png";
import SearchIcon from "../../../assets/icons/Icon (6).png";
import EditIcon from "../../../assets/icons/Icon.png";

import { Menu as MenuIcon, X as CloseIcon } from "lucide-react";

export default function Products() {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState({ name: "Lara", image: LaraImage });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [showDot, setShowDot] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  // Search
  const [searchValue, setSearchValue] = useState("");

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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

  // Handle Delete Product
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        setProducts((prev) => prev.filter((p) => p.id !== id)); 
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product");
      }
    }
  };

  // Filtered Products
  const filteredProducts = products.filter(
    (p) =>
      searchValue === "" ||
      p.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
      p.id.toString().includes(searchValue)
  );

  // Pagination
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

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

      {/* Main */}
      <div className="orders-main">
        <header className="orders-header">
          <button
            className="orders-menu-btn"
            onClick={() => setIsSidebarOpen(true)}
          >
            <MenuIcon size={24} />
          </button>
          <h2>Products</h2>
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
              <input
                type="text"
                placeholder="Search by product name or ID"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <img src={SearchIcon} alt="Search" className="search-icon" />
            </div>

            <button
              className="add-btn"
              onClick={() => navigate("/products/add")}
            >
              + Add new Products
            </button>
          </div>

          {/* Table */}
          <table className="orders-table">
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Stock Available</th>
                <th>Stock</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.available}</td>
                  <td>{p.stock}</td>
                  <td>{p.name}</td>
                  <td>₪{p.price}</td>
                  <td style={{ display: "flex", gap: "8px" }}>
                    {/* Edit Button */}
                    <button
                      className="orders-edit-btn"
                      onClick={() => navigate(`/products/${p.id}`)}
                    >
                      <img src={EditIcon} alt="Edit" />
                    </button>

                    {/* Delete Button */}
                    <button
                      className="orders-delete-btn"
                      onClick={() => handleDelete(p.id)}
                    >
                      <img src={DeleteIcon} alt="Delete" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
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
