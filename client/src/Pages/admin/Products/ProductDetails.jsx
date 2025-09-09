import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { getProductById, updateProduct } from "../../../api";
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

import { Menu as MenuIcon, X as CloseIcon } from "lucide-react";

const ALL_SIZES = ["XS", "S", "M", "L", "XL", "2X"];
const ALL_COLORS = [
  { name: "nude", hex: "#e0c7a0" },
  { name: "black", hex: "#000000" },
];

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [product, setProduct] = useState(null);
  const [user, setUser] = useState({ name: "Lara", image: LaraImage });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showDot, setShowDot] = useState(false);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [availability, setAvailability] = useState("In Stock");
  const [stock, setStock] = useState(0);
  const [description, setDescription] = useState("");
  const [imageFiles, setImageFiles] = useState([]); 
  const [previewImages, setPreviewImages] = useState([]); 

 // Fetch product
useEffect(() => {
  const fetchProduct = async () => {
    const data = await getProductById(id);
    if (!data.error) {
      setProduct(data);

      setName(data.name || "");
      setPrice(data.price || "");
      setSizes(data.sizes || []);

      if (Array.isArray(data.colors)) {
        setColors(data.colors);
      } else if (typeof data.colors === "string") {
        setColors(data.colors.split(","));
      } else {
        setColors([]);
      }

      const avail = String(data.available).toLowerCase().trim();
      setAvailability(avail === "out of stock" ? "Out of Stock" : "In Stock");

      setStock(data.stock || 0);
      setDescription(data.description || "");
      if (Array.isArray(data.images) && data.images.length > 0) {
        setPreviewImages(data.images);
      } else if (typeof data.images === "string" && data.images) {
        setPreviewImages([data.images]);
      } else if (data.image) { 
        setPreviewImages([data.image]);
      } else {
        setPreviewImages([]);
      }

      setImageFiles([]);
    }
  };
  fetchProduct();
}, [id]);


  // Protect admin
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
    navigate("/login");
  };

  const goToHome = () => navigate("/");

  if (!product) return <p style={{ padding: 20 }}>Loading product details...</p>;

  const toggleSize = (size) => {
    if (sizes.includes(size)) setSizes(sizes.filter((s) => s !== size));
    else setSizes([...sizes, size]);
  };

  const toggleColor = (colorName) => {
    if (colors.includes(colorName)) setColors(colors.filter((c) => c !== colorName));
    else setColors([...colors, colorName]);
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImageFiles((prev) => [...prev, ...filesArray]);

      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setPreviewImages((prev) => [...prev, ...newPreviews]);
    }
  };

  const handleRemoveImage = (index) => {
    if (index >= previewImages.length - imageFiles.length) {
      const fileIndex = index - (previewImages.length - imageFiles.length);
      setImageFiles((prev) => prev.filter((_, i) => i !== fileIndex));
    }

    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("sizes", JSON.stringify(sizes));
    formData.append("colors", colors.join(","));
    formData.append("available", availability);
    formData.append("stock", stock);
    formData.append("description", description);

    imageFiles.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const res = await updateProduct(product.id, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.error) {
        alert("Failed to update product: " + res.error);
      } else {
        alert("Product updated successfully!");
        navigate("/products");
      }
    } catch (err) {
      alert("Something went wrong while saving the product.");
      console.error(err);
    }
  };

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
            <img src={LinkIcon} alt="Link" className="icon" />
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
          <h2>Product Details</h2>
          <div className="orders-header-right">
            <button className="orders-icon-btn" style={{ position: "relative" }} onClick={() => setShowDot(false)}>
              <img src={NotificationIcon} alt="Notification" />
              {showDot && (
                <img src={DotIcon} alt="Dot" style={{ position: "absolute", top: 0, right: 0, width: 6, height: 6 }} />
              )}
            </button>
            <img src={user.image} alt={user.name} className="orders-profile" />
          </div>
        </header>

        <main className="product-details-content">
          <form className="product-edit-form" onSubmit={handleSave}>
            {/* Name, Price, Sizes, Colors, Availability, Stock, Description */}
            <div className="form-row">
              <label>Product name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="form-row">
              <label>Price</label>
              <input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>

            <div className="form-row">
              <label>Size</label>
              <div className="checkbox-group horizontal">
                {ALL_SIZES.map((size) => (
                  <label key={size} className="checkbox-label">
                    <input type="checkbox" checked={sizes.includes(size)} onChange={() => toggleSize(size)} />
                    {size}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-row">
              <label>Color</label>
              <div className="checkbox-group horizontal">
                {ALL_COLORS.map(({ name, hex }) => (
                  <label key={name} className="checkbox-label color-label">
                    <input type="checkbox" checked={colors.includes(name)} onChange={() => toggleColor(name)} />
                    <span className="color-circle" style={{ backgroundColor: hex, marginRight: 8, display: "inline-block", width: 20, height: 20, borderRadius: "50%", border: "1px solid #ccc" }} />
                    {name}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-row">
              <label>Availability</label>
              <select value={availability} onChange={(e) => setAvailability(e.target.value)}>
                <option value="In Stock">In Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>

            <div className="form-row">
              <label>Quantity</label>
              <input type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} />
            </div>

            <div className="form-row full-width">
              <label>Description</label>
              <textarea rows="3" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

              {/* Images */}
                  <div className="image-upload-combined-row">
              {(previewImages && previewImages.length > 0) ? (
                previewImages.map((src, index) => (
                  <div key={index} style={{ position: "relative", display: "inline-block", marginRight: 10 }}>
                    <img
                      src={
                        src.startsWith("blob:") || src.startsWith("/") 
                          ? src
                          : `/images/${src}` 
                      }
                      alt={`Product ${index + 1}`}
                      style={{ width: 100, height: 100, objectFit: "cover" }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      style={{
                        position: "absolute",
                        top: 2,
                        right: 2,
                        backgroundColor: "rgba(255,0,0,0.7)",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: 20,
                        height: 20,
                        cursor: "pointer"
                      }}
                      aria-label="Remove image"
                    >
                      ×
                    </button>
                  </div>
                ))
              ) : (
                <img src="/placeholder.png" alt="No images" style={{ width: 100, height: 100, objectFit: "cover" }} />
              )}

              <input type="file" accept="image/*" multiple onChange={handleImageChange} className="upload-input" />
            </div>




            <div className="form-row button-row">
              <button type="submit" className="edit-product-btn">Edit Product</button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
