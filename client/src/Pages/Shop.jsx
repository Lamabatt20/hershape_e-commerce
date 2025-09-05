import React, { useState, useEffect } from "react";
import Footer from "../Components/Footer";
import { Link } from "react-router-dom";
import { getProducts } from "../api"; 
import "./Shop.css";

import filterIcon from "../assets/icons/filter.png";

const sizes = ["XS", "S", "M", "L", "XL", "2XL"];
const colors = ["black", "nude"]; 

function Shop() {
  const [products, setProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 150]);
  const [availability, setAvailability] = useState({
    inStock: false,
    outOfStock: false,
  });
  const [loading, setLoading] = useState(true);

  const productsPerPage = 6;


  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts();
      if (!data.error) {
        setProducts(data);
      } else {
        console.error(data.error);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

 
  const clearFilters = () => {
    setSelectedSize(null);
    setSelectedColor(null);
    setPriceRange([0, 150]);
    setAvailability({ inStock: false, outOfStock: false });
    setIsFilterOpen(false);
  };

 
  const filteredProducts = products.filter((product) => {
    if (selectedSize && !product.sizes.includes(selectedSize)) return false;
    if (selectedColor && !product.colors.includes(selectedColor)) return false;
    if (product.price < priceRange[0] || product.price > priceRange[1]) return false;

    if (availability.inStock && availability.outOfStock) {
    } else {
      if (availability.inStock && product.available !== "In stock") return false;
      if (availability.outOfStock && product.available !== "Out of stock") return false;
    }
    return true;
  });


  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === "price-low-high") return a.price - b.price;
    if (sortOrder === "price-high-low") return b.price - a.price;
    return a.id - b.id;
  });


  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <>
      <div className="shop-container">
     
        <aside className={`filter-section ${isFilterOpen ? "open" : ""}`}>
          <button className="close-filter-btn" onClick={() => setIsFilterOpen(false)}>
            ✖
          </button>

          <div className="filter-block">
            <label>Price Filter</label>
            <input
              type="range"
              min="0"
              max="150"
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
                onChange={(e) =>
                  setAvailability({ ...availability, inStock: e.target.checked })
                }
              />{" "}
              <span>In stock</span>
            </div>
            <div>
              <input
                type="checkbox"
                checked={availability.outOfStock}
                onChange={(e) =>
                  setAvailability({ ...availability, outOfStock: e.target.checked })
                }
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

          <button className="clear-filter-btn" onClick={clearFilters}>
            Clear Filters
          </button>
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
                <img src={process.env.PUBLIC_URL + product.image} alt={product.name} />
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
            >
              ←
            </button>
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
            >
              →
            </button>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}

export default Shop;
