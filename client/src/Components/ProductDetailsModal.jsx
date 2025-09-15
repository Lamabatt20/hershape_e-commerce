import React, { useState, useEffect } from "react";
import ProductDetails from "./ProductDetails";
import "./ProductDetailsModal.css";

const ProductDetailsModal = ({ productId, onClose, onUpdate }) => {
  const [productData, setProductData] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${productId}`);
        const data = await res.json();
        setProductData(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProduct();
  }, [productId]);

  if (!productData) return <div className="modal-loading">Loading...</div>;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <ProductDetails
          modal
          initialProduct={productData}
          onUpdate={onUpdate}
          onClose={onClose}
        />
        <div className="modal-buttons">
          <button onClick={() => onUpdate(productData)} className="update-btn">
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;
