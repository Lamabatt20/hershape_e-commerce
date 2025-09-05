import React, { useEffect, useState, useRef } from "react";
import fullCorset from "../assets/images/F.png";
import waistCorset from "../assets/images/W.png";
import doubleCorset from "../assets/images/D.png";
import "./CorsetSection.css";

const corsetProducts = [
  { id: 1, name: "Full Corset", price: "₪85", image: fullCorset },
  { id: 2, name: "Waist Corset", price: "₪65", image: waistCorset },
  { id: 3, name: "Double Corset", price: "₪95", image: doubleCorset },
];

function CorsetSection() {
  const [products, setProducts] = useState([]);
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    setProducts(corsetProducts);
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
            <img src={product.image} alt={product.name} />
            <h4>{product.name}</h4>
            <p>{product.price}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CorsetSection;
