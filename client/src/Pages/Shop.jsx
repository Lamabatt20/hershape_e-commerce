import React, { useState, useEffect } from "react";
import Footer from "../Components/Footer";
import { Link } from "react-router-dom";
import { getProducts } from "../api"; 
import "./Shop.css";

import filterIcon from "../assets/icons/filter.png";

function Shop() {
  const [products, setProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 400]);
  const [availability, setAvailability] = useState({ inStock: false, outOfStock: false });
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState("en");

  const productsPerPage = 6;

  const sizes = ["XS", "S", "M", "L", "XL", "2XL","3XL","4XL","XS-S","M-L","XL-2XL","3XL-4XL"];
  const colors = ["black", "nude","beige"]; 

  useEffect(() => {
    const storedLang = localStorage.getItem("language") || "en";
    setLanguage(storedLang);

    const handleLangChange = () => {
      const updatedLang = localStorage.getItem("language") || "en";
      setLanguage(updatedLang);
    };

    window.addEventListener("storageLanguageChanged", handleLangChange);
    return () => window.removeEventListener("storageLanguageChanged", handleLangChange);
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const data = await getProducts();
    if (!data.error && Array.isArray(data)) setProducts(data);
    setCurrentPage(1);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const clearFilters = () => {
    setSelectedSize(null);
    setSelectedColor(null);
    setPriceRange([0, 400]);
    setAvailability({ inStock: false, outOfStock: false });
    setIsFilterOpen(false);
    setCurrentPage(1);
  };

  const filteredProducts = Array.isArray(products)
  ? products.filter(product => {
      const matchingVariant = product.variants?.some(variant => {
        const sizeMatch = selectedSize ? variant.size === selectedSize : true;
        const colorMatch = selectedColor ? variant.color === selectedColor : true;
        return sizeMatch && colorMatch;
      });

      if (!matchingVariant) return false;

      if (product.price < priceRange[0] || product.price > priceRange[1]) return false;

      
      const totalStock = product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;
      if (availability.inStock && availability.outOfStock) return true;
      if (availability.inStock && totalStock === 0) return false;
      if (availability.outOfStock && totalStock > 0) return false;

      return true;
    })
  : [];


  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOrder) {
      case "price-low-high": return a.price - b.price;
      case "price-high-low": return b.price - a.price;
      case "best-selling": return (b.sold || 0) - (a.sold || 0);
      case "newest": return b.id - a.id;
      case "oldest": return a.id - b.id;
      case "alphabetical-asc": return a.name.localeCompare(b.name);
      case "alphabetical-desc": return b.name.localeCompare(a.name);
      default: return a.id - b.id;
    }
  });

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages || 1);
  }, [totalPages, currentPage]);

  if (loading) return <p style={{ textAlign: "center" }}>{language === "en" ? "Loading..." : "جارٍ التحميل..."}</p>;

  return (
    <>
      <div className="shop-container">
        <aside className={`filter-section ${isFilterOpen ? "open" : ""}`}>
          <button className="close-filter-btn" onClick={() => setIsFilterOpen(false)}>✖</button>

          <div className="filter-block">
            <label>{language === "en" ? "Price Filter" : "تصفية بالسعر"}</label>
            <input
              type="range"
              min="0"
              max="400"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
            />
            <div className="price-range">
              <span>₪{priceRange[0]} - </span>
              <span>₪{priceRange[1]}</span>
            </div>
          </div>

          <div className="filter-block">
            <label>{language === "en" ? "Size" : "المقاس"}</label>
            <div className="size-options">
              {sizes.map(size => (
                <button
                  key={size}
                  className={selectedSize === size ? "size-btn active" : "size-btn"}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-block">
            <label>{language === "en" ? "Availability" : "التوفّر"}</label>
            <div>
              <input
                type="checkbox"
                checked={availability.inStock}
                onChange={e => setAvailability({ ...availability, inStock: e.target.checked })}
              />{" "}
              <span>{language === "en" ? "In stock" : "متوفر"}</span>
            </div>
            <div>
              <input
                type="checkbox"
                checked={availability.outOfStock}
                onChange={e => setAvailability({ ...availability, outOfStock: e.target.checked })}
              />{" "}
              <span>{language === "en" ? "Out of stock" : "غير متوفر"}</span>
            </div>
          </div>

          <div className="filter-block">
            <label>{language === "en" ? "Filter by color" : "تصفية حسب اللون"}</label>
            <div className="color-options">
              {colors.map(color => (
                <span
                  key={color}
                  className={`color ${color} ${selectedColor === color ? "active" : ""}`}
                  onClick={() => setSelectedColor(color)}
                ></span>
              ))}
            </div>
          </div>

          <button className="clear-filter-btn" onClick={clearFilters}>
            {language === "en" ? "Clear Filters" : "إزالة الفلاتر"}
          </button>
        </aside>

        <main className="products-section">
          <div className="products-header">
            <h4>{language === "en" ? "All Products" : "كل المنتجات"}</h4>
          </div>

          <div className="sort-bar">
            <button className="filter-toggle-btn" onClick={() => setIsFilterOpen(true)}>
              <img src={filterIcon} alt="Filter Icon" />
              <span>{language === "en" ? "Filter" : "فلترة"}</span>
            </button>

            <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
              <option value="default">{language === "en" ? "Default Sorting" : "الترتيب الافتراضي"}</option>
              <option value="price-low-high">{language === "en" ? "Price: Low to High" : "السعر: من الأقل للأعلى"}</option>
              <option value="price-high-low">{language === "en" ? "Price: High to Low" : "السعر: من الأعلى للأقل"}</option>
              <option value="best-selling">{language === "en" ? "Best Selling" : "الأكثر مبيعًا"}</option>
              <option value="newest">{language === "en" ? "Newest" : "الأحدث"}</option>
              <option value="oldest">{language === "en" ? "Oldest" : "الأقدم"}</option>
              <option value="alphabetical-asc">{language === "en" ? "Name: A-Z" : "الاسم: أ-ي"}</option>
              <option value="alphabetical-desc">{language === "en" ? "Name: Z-A" : "الاسم: ي-أ"}</option>
            </select>
          </div>

          <div className="products-grid">
            {currentProducts.map(product => (
              <div key={product.id} className="product-card">
                <Link to={`/product/${product.id}`} className="product-link">
                  <img
                    src={product.images && product.images.length > 0
                      ? product.images[0].startsWith("/") ? product.images[0] : `/images/${product.images[0]}`
                      : "/placeholder.png"
                    }
                    alt={language === "en" ? product.name : product.name_ar || product.name}
                  />
                  <h3>{language === "en" ? product.name : product.name_ar || product.name}</h3>
                  <p>₪{product.price}</p>
                </Link>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>←</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={currentPage === i + 1 ? "active" : ""}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>→</button>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}

export default Shop;
