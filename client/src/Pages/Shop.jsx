import React, { useState, useEffect } from "react";
import Footer from "../Components/Footer";
import { Link } from "react-router-dom";
import { getProducts } from "../api"; 
import "./Shop.css";

import filterIcon from "../assets/icons/filter.png";

const sizes = ["XS", "S", "M", "L", "XL", "2XL"];
const colors = ["black", "nude","beige"]; 

function Shop() {
  const [products, setProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 400]);
  const [availability, setAvailability] = useState({ InStock: false, outOfStock: false });
  const [loading, setLoading] = useState(true);

  const productsPerPage = 6;

  // ======== Fetch All Products from DB ========
  const fetchProducts = async () => {
    setLoading(true);
    const data = await getProducts(); 
    console.log("Fetched Products:", data);
    if (!data.error && Array.isArray(data)) setProducts(data);
    setCurrentPage(1);
    setLoading(false);
  };

  // ======== Initial Load ========
  useEffect(() => {
    fetchProducts();
  }, []);

  // ======== Clear Filters ========
  const clearFilters = () => {
    setSelectedSize(null);
    setSelectedColor(null);
    setPriceRange([0, 400]); 
    setAvailability({  InStock: false, outOfStock: false });
    setIsFilterOpen(false);
    setCurrentPage(1);
  };

  // ======== Filter Products ========
  const filteredProducts = Array.isArray(products)
    ? products.filter((product) => {
        const productSizes = Array.isArray(product.sizes)
          ? product.sizes
          : product.sizes
          ? product.sizes.split(",").map(s => s.trim())
          : [];

        const productColors = Array.isArray(product.colors)
          ? product.colors
          : product.colors
          ? product.colors.split(",").map(c => c.trim())
          : [];

        if (selectedSize && !productSizes.includes(selectedSize)) return false;
        if (selectedColor && !productColors.includes(selectedColor)) return false;

        if (product.price < priceRange[0] || product.price > priceRange[1]) return false;

        if (availability.InStock && availability.outOfStock) return true;
        if (availability.InStock && product.available !== "In stock") return false;
        if (availability.outOfStock && product.available !== "Out of stock") return false;

        return true;
      })
    : [];

  // ======== Sorting ========
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === "price-low-high") return a.price - b.price;
    if (sortOrder === "price-high-low") return b.price - a.price;
    return a.id - b.id;
  });

  // ======== Pagination ========
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages || 1);
  }, [totalPages, currentPage]);

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <>
      <div className="shop-container">
        <aside className={`filter-section ${isFilterOpen ? "open" : ""}`}>
          <button className="close-filter-btn" onClick={() => setIsFilterOpen(false)}>✖</button>

          <div className="filter-block">
            <label>Price Filter</label>
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
            <label>Size</label>
            <div className="size-options">
              {sizes.map((size) => (
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
            <label>Availability</label>
            <div>
              <input
                type="checkbox"
                checked={availability.inStock}
                onChange={(e) => setAvailability({ ...availability, inStock: e.target.checked })}
              />{" "}
              <span>In stock</span>
            </div>
            <div>
              <input
                type="checkbox"
                checked={availability.outOfStock}
                onChange={(e) => setAvailability({ ...availability, outOfStock: e.target.checked })}
              />{" "}
              <span>Out of stock</span>
            </div>
          </div>

          <div className="filter-block">
            <label>Filter by color</label>
            <div className="color-options">
              {colors.map((color) => (
                <span
                  key={color}
                  className={`color ${color} ${selectedColor === color ? "active" : ""}`}
                  onClick={() => setSelectedColor(color)}
                ></span>
              ))}
            </div>
          </div>

          <button className="clear-filter-btn" onClick={clearFilters}>Clear Filters</button>
        </aside>

        <main className="products-section">
          <div className="products-header">
            <h4>All Products</h4>
          </div>

          <div className="sort-bar">
            <button className="filter-toggle-btn" onClick={() => setIsFilterOpen(true)}>
              <img src={filterIcon} alt="Filter Icon" />
              <span>Filter</span>
            </button>

            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="default">Default Sorting</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
            </select>
          </div>

          <div className="products-grid">
            {currentProducts.map((product) => (
              <div key={product.id} className="product-card">
                <Link to={`/product/${product.id}`} className="product-link">
                  <img
                    src={product.images && product.images.length > 0
                      ? product.images[0].startsWith("/")
                        ? product.images[0]
                        : `/images/${product.images[0]}`
                      : "/placeholder.png"
                    }
                    alt={product.name}
                  />
                  <h3>{product.name}</h3>
                  <p>₪{product.price}</p>
                </Link>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >←</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={currentPage === i + 1 ? "active" : ""}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >→</button>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}

export default Shop;
