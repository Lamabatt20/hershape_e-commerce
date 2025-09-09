import React, { useEffect, useState, useRef } from "react";
import "./FeaturedProducts.css";
import { useNavigate, Link } from "react-router-dom";
import { getProducts } from "../api";

function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const cardsRef = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts();
      if (!data.error) {
        setProducts(data.slice(0, 6));
      } else {
        console.error(data.error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const cards = cardsRef.current;
    cards.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => {
      cards.forEach((card) => {
        if (card) observer.unobserve(card);
      });
    };
  }, [products]);

  return (
    <section className="featured-section">
      <h2>Featured products</h2>
      <div className="products-grid">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="product-card"
            ref={(el) => (cardsRef.current[index] = el)}
          >
            <Link to={`/product/${product.id}`} className="product-link">
             <img
              src={
                process.env.PUBLIC_URL +
                (Array.isArray(product.images) && product.images.length > 0
                   ? product.images[0].startsWith("/")
                        ? product.images[0]
                        : `/images/${product.images[0]}`
                      : "/placeholder.png")
              }
              alt={product.name}
            />
              <h4>{product.name}</h4>
              <p>{product.price} ₪</p>
            </Link>
          </div>
        ))}
      </div>
      <button className="see-all-btn" onClick={() => navigate("/Shop")}>
        See all →
      </button>
    </section>
  );
}

export default FeaturedProducts;
