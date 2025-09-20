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

const ALL_COLORS = [
  { name: "nude", hex: "#ecc7b5" },
  { name: "black", hex: "#000000" },
  { name: "beige", hex: "#e0c7a0" }
];

const ALL_SIZES = [
  "XS", "S", "M", "L", "XL",
  "2XL", "3XL", "4XL",
  "XS-S", "M-L", "XL-2XL", "3XL-4XL"
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
  const [nameAr, setNameAr] = useState("");
  const [price, setPrice] = useState("");
  const [availability, setAvailability] = useState("In Stock");
  const [stockQty, setStockQty] = useState(0); // حقل كمية المخزون
  const [description, setDescription] = useState("");
  const [descriptionAr, setDescriptionAr] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);

  const [colors, setColors] = useState([]);
  const [sizesByColor, setSizesByColor] = useState({});

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      const data = await getProductById(id);
      if (!data.error) {
        setProduct(data);
        setName(data.name || "");
        setNameAr(data.name_ar || "");
        setPrice(data.price || "");
        setDescription(data.description || "");
        setDescriptionAr(data.description_ar || "");
        const avail = String(data.available).toLowerCase().trim();
        setAvailability(avail === "out of stock" ? "Out of Stock" : "In Stock");
        setStockQty(data.stock ?? 0);

        if (Array.isArray(data.images) && data.images.length > 0) setPreviewImages(data.images);
        else if (typeof data.images === "string" && data.images) setPreviewImages([data.images]);
        else setPreviewImages([]);
        setImageFiles([]);
        setRemovedImages([]);

        if (data.variants && data.variants.length > 0) {
          const colorMap = {};
          data.variants.forEach(variant => {
            if (!colorMap[variant.color]) {
              colorMap[variant.color] = ALL_SIZES.map((s) => ({
                size: s,
                stock: 0,
                available: false
              }));
            }
            const sizeIndex = colorMap[variant.color].findIndex(s => s.size === variant.size);
            if (sizeIndex >= 0) {
              colorMap[variant.color][sizeIndex] = {
                size: variant.size,
                stock: variant.stock,
                available: true
              };
            }
          });
          setSizesByColor(colorMap);
          setColors(Object.keys(colorMap));
        }
      }
    };
    fetchProduct();
  }, [id]);

  // Check user
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

  if (!product) return <p style={{ padding: 20 }}>Loading product details...</p>;

  const handleImageChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImageFiles((prev) => [...prev, ...filesArray]);
      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setPreviewImages((prev) => [...prev, ...newPreviews]);
    }
  };
  const handleRemoveImage = (index) => {
    const removed = previewImages[index];
    if (!removed.startsWith("blob:")) setRemovedImages((prev) => [...prev, removed]);
    else {
      const fileIndex = index - (previewImages.length - imageFiles.length);
      setImageFiles((prev) => prev.filter((_, i) => i !== fileIndex));
    }
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("name_ar", nameAr);
    formData.append("price", price);
    formData.append("available", availability);
    formData.append("stock", stockQty); // إضافة المخزون
    formData.append("description", description);
    formData.append("description_ar", descriptionAr);
    imageFiles.forEach((file) => formData.append("images", file));
    removedImages.forEach((img) => formData.append("removedImages", img));

    const variantsToSend = [];
    Object.entries(sizesByColor).forEach(([color, sizesArr]) => {
      sizesArr.forEach(v => {
        if (v.available) {
          variantsToSend.push({ color, size: v.size, stock: v.stock });
        }
      });
    });
    formData.append("variants", JSON.stringify(variantsToSend));

    try {
      const res = await updateProduct(product.id, formData, { headers: { "Content-Type": "multipart/form-data" } });
      if (res.error) alert("Failed to update product: " + res.error);
      else {
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
          <h2>Product Details</h2>
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
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="form-row">
              <label>Product name (Arabic)</label>
              <input type="text" value={nameAr} onChange={(e) => setNameAr(e.target.value)} />
            </div>

            <div className="form-row">
              <label>Price</label>
              <input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
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
              <div className="checkbox-group" style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "flex-start" }}>
                {ALL_COLORS.map((color) => {
                  const isChecked = colors.includes(color.name);

                  return (
                    <div key={color.name} style={{ minWidth: 150 }}>
                      <label className="checkbox-label color-label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setColors((prev) => [...prev, color.name]);
                              setSizesByColor((prev) => ({
                                ...prev,
                                [color.name]:
                                  prev[color.name] && prev[color.name].length > 0
                                    ? prev[color.name]
                                    : ALL_SIZES.map((s) => ({ size: s, stock: 0, available: false }))
                              }));
                            } else {
                              setColors((prev) => prev.filter((c) => c !== color.name));
                              setSizesByColor((prev) => {
                                const newObj = { ...prev };
                                delete newObj[color.name];
                                return newObj;
                              });
                            }
                          }}
                        />
                        <span className="color-circle" style={{
                          backgroundColor: color.hex,
                          display: "inline-block",
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          border: "1px solid #ccc"
                        }} />
                        {color.name}
                      </label>

                      {isChecked && (
                        <div style={{ marginTop: 10 }}>
                          {sizesByColor[color.name]?.map((item, index) => (
                            <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
                              <input
                                type="checkbox"
                                checked={item.available}
                                onChange={(e) => {
                                  const available = e.target.checked;
                                  setSizesByColor((prev) => ({
                                    ...prev,
                                    [color.name]: prev[color.name].map((s, i) =>
                                      i === index ? { ...s, available } : s
                                    )
                                  }));
                                }}
                              />
                              <span style={{ display: "inline-block", width: 70, margin: "0 8px" }}>
                                {item.size}
                              </span>
                              <input
                                type="number"
                                min="0"
                                value={item.stock}
                                onChange={(e) => {
                                  const newStock = Number(e.target.value);
                                  setSizesByColor((prev) => ({
                                    ...prev,
                                    [color.name]: prev[color.name].map((s, i) =>
                                      i === index ? { ...s, stock: newStock } : s
                                    )
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

            <div className="image-upload-combined-row">
              {previewImages && previewImages.length > 0 ? (
                previewImages.map((src, index) => (
                  <div key={index} style={{ position: "relative", display: "inline-block", marginRight: 10 }}>
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
