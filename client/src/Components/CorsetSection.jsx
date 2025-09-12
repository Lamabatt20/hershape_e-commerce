import React, { useEffect, useState, useRef } from "react";
import { getProducts } from "../api";
import "./CorsetSection.css";
import {  Link } from "react-router-dom";

function CorsetSection() {
  const [products, setProducts] = useState([]);
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const fetchCorsets = async () => {
      try {
        const res = await getProducts();
        const selectedIds = [16, 17, 19];
        const filtered = res.filter((item) => selectedIds.includes(item.id));

        setProducts(filtered);
      } catch (err) {
        console.error("Error fetching corsets:", err);
      }
    };

    fetchCorsets();
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

    const elements = cardsRef.current;
    elements.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => {
      elements.forEach((card) => {
        if (card) observer.unobserve(card);
      });
    };
  }, [products]);

  return (
    <section className="corset-section" ref={sectionRef}>
      <h2>We Will Like</h2>

      <div className="corset-grid">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="corset-card"
            ref={(el) => (cardsRef.current[index] = el)}
          >
             <Link to={`/product/${product.id}`} className="product-link">
            <img
              src={
                product.images && product.images.length > 0
                  ? product.images[0]
                  : "/placeholder.png"
              }
              alt={product.name}
            />
            <h4>{product.name}</h4>
            <p>₪{product.price}</p>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CorsetSection;
