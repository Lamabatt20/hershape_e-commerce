import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { createProduct } from "../../../api"; 
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

const ALL_SIZES = ["XS", "S", "M", "L", "XL", "2XL","3XL","4XL","XS-S","M-L","XL-2XL","3XL-4XL"];
const ALL_COLORS = [
  { name: "nude", hex: "#ecc7b5" },
  { name: "black", hex: "#000000" },
  { name: "beige", hex: "#e0c7a0" }
];

export default function AddProduct() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState({ name: "Lara", image: LaraImage });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showDot, setShowDot] = useState(false);

  const [name, setName] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [price, setPrice] = useState("");
  const [availability, setAvailability] = useState("In Stock");
  const [description, setDescription] = useState("");
  const [descriptionAr, setDescriptionAr] = useState("");
  const [imageFiles, setImageFiles] = useState([]); 
  const [previewImages, setPreviewImages] = useState([]);
  
  const [colors, setColors] = useState([]);
  const [sizesByColor, setSizesByColor] = useState({});

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || storedUser.role !== "admin") navigate("/login", { replace: true });
    else setUser({ name: storedUser.name || "Lara", image: storedUser.image || LaraImage });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const goToHome = () => navigate("/");

  const toggleColor = (colorName) => {
    if (colors.includes(colorName)) {
      setColors(colors.filter(c => c !== colorName));
      setSizesByColor(prev => {
        const newObj = { ...prev };
        delete newObj[colorName];
        return newObj;
      });
    } else {
      setColors([...colors, colorName]);
      setSizesByColor(prev => ({
        ...prev,
        [colorName]: ALL_SIZES.map(size => ({ size, available: false, stock: 0 }))
      }));
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImageFiles(prev => [...prev, ...filesArray]);
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setPreviewImages(prev => [...prev, ...newPreviews]);
    }
  };

  const handleRemoveImage = (index) => {
    if (index >= previewImages.length - imageFiles.length) {
      const fileIndex = index - (previewImages.length - imageFiles.length);
      setImageFiles(prev => prev.filter((_, i) => i !== fileIndex));
    }
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("name_ar", nameAr);
    formData.append("price", price);
    formData.append("available", availability);
    formData.append("description", description);
    formData.append("description_ar", descriptionAr);
    imageFiles.forEach(file => formData.append("images", file));

    const variants = [];
    Object.entries(sizesByColor).forEach(([color, arr]) => {
      arr.forEach(v => {
        if (v.available) variants.push({ color, size: v.size, stock: v.stock });
      });
    });
    formData.append("variants", JSON.stringify(variants));

    try {
      const res = await createProduct(formData, { headers: { "Content-Type": "multipart/form-data" } });
      if (res.error) alert("Failed to add product: " + res.error);
      else {
        alert("Product added successfully!");
        navigate("/products");
      }
    } catch (err) {
      alert("Something went wrong while adding the product.");
      console.error(err);
    }
  };

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

      <div className="orders-main">
        <header className="orders-header">
          <button className="orders-menu-btn" onClick={() => setIsSidebarOpen(true)}>
            <MenuIcon size={24} />
          </button>
          <h2>Add Product</h2>
          <div className="orders-header-right">
            <button className="orders-icon-btn" style={{ position: "relative" }} onClick={() => setShowDot(false)}>
              <img src={NotificationIcon} alt="Notification" />
              {showDot && <img src={DotIcon} alt="Dot" style={{ position: "absolute", top: 0, right: 0, width: 6, height: 6 }} />}
            </button>
            <img src={user.image} alt={user.name} className="orders-profile" />
          </div>
        </header>

        <main className="product-details-content">
          <form className="product-edit-form" onSubmit={handleSave}>
            <div className="form-row">
              <label>Product name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="form-row">
              <label>Product name (Arabic)</label>
              <input type="text" value={nameAr} onChange={(e) => setNameAr(e.target.value)} required />
            </div>

            <div className="form-row">
              <label>Price</label>
              <input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>

            <div className="form-row">
              <label>Availability</label>
              <select value={availability} onChange={(e) => setAvailability(e.target.value)}>
                <option value="In Stock">In Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>

            <div className="form-row full-width">
              <label>Description</label>
              <textarea rows="3" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div className="form-row full-width">
              <label>Description (Arabic)</label>
              <textarea rows="3" value={descriptionAr} onChange={(e) => setDescriptionAr(e.target.value)} />
            </div>

       <div className="form-row">
        <label>Colors & Sizes</label>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-start" }}>
          {ALL_COLORS.map(color => {
            const isChecked = colors.includes(color.name);
            return (
              <div key={color.name} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, minHeight: 28 }}>
                  <input 
                    type="checkbox" 
                    checked={isChecked} 
                    onChange={() => toggleColor(color.name)} 
                    style={{ 
                      transform: "scale(1.5)", 
                      transformOrigin: "top left", 
                      margin: 0 
                    }} 
                  />
                  <span style={{
                    width: 20, 
                    height: 20, 
                    borderRadius: "50%", 
                    border: "1px solid #ccc", 
                    backgroundColor: color.hex
                  }} />
                  {color.name}
                </label>

                {isChecked && (
                  <div style={{ marginTop: 8 }}>
                    {sizesByColor[color.name]?.map((item, index) => (
                      <div key={index} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6, minHeight: 24 }}>
                        <input 
                          type="checkbox" 
                          checked={item.available} 
                          onChange={(e) => {
                            const available = e.target.checked;
                            setSizesByColor(prev => ({
                              ...prev,
                              [color.name]: prev[color.name].map((s, i) => i === index ? { ...s, available } : s)
                            }));
                          }} 
                          style={{ 
                            transform: "scale(1.3)", 
                            transformOrigin: "top left", 
                            margin: 0 
                          }} 
                        />
                        <span style={{ display: "inline-block", width: 70, margin: "0 8px" }}>{item.size}</span>
                        <input 
                          type="number" 
                          min="0" 
                          value={item.stock} 
                          onChange={(e) => {
                            const stock = Number(e.target.value);
                            setSizesByColor(prev => ({
                              ...prev,
                              [color.name]: prev[color.name].map((s, i) => i === index ? { ...s, stock } : s)
                            }));
                          }} 
                          style={{ width: 60 }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

           <div className="image-upload-combined-row" style={{ marginTop: 20, width: "100%" }}>
           <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {previewImages.length > 0 ? (
                  previewImages.map((src, index) => (
                    <div key={index} style={{ position: "relative" }}>
                      <img
                        src={src.startsWith("blob:") || src.startsWith("/") ? src : `/images/${src}`}
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
                  <img
                    src="/images/No-Image-Placeholder.svg.png"
                    alt="No images"
                    style={{ width: 100, height: 100, objectFit: "cover" }}
                  />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="upload-input"
                style={{ display: "block", marginTop: 10 }}
              />
            </div>

            <div className="form-row button-row">
              <button type="submit" className="edit-product-btn">Add Product</button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
