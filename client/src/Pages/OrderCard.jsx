import React, { useState, useRef, useEffect } from "react";

const OrderCard = ({ order }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showUpdated, setShowUpdated] = useState(false);
  const detailsRef = useRef(null);

  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (order.updatedAt && order.updatedAt !== order.createdAt) {
      setShowUpdated(true);
    }
  }, [order.updatedAt, order.createdAt]);

  const handleToggleDetails = () => {
    setShowDetails(!showDetails);

    if (!showDetails) {
      setShowUpdated(false);
    }
  };

  return (
    <div className={`order-card ${order.status === "paid" ? "paid" : ""}`}>
      <div className="order-summary">
        <p><strong>Order ID:</strong> {order.id}</p>
        <div className="order-items-count">
          <p>{totalItems} items</p>
        </div>
        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
        <p><strong>Total:</strong> ₪{order.subtotal}</p>
        <p>
          <strong>Status:</strong> {order.status}
          {showUpdated && <span className="order-updated"> Updated!</span>}
        </p>
        <button onClick={handleToggleDetails}>
          {showDetails ? "Hide Details" : "View Details"}
        </button>
      </div>

      <div
        className="order-details"
        ref={detailsRef}
        style={{
          maxHeight: showDetails ? detailsRef.current?.scrollHeight : 0,
          overflow: "hidden",
          transition: "max-height 0.3s ease",
        }}
      >
        {order.items.map((item) => (
          <div className="product-item" key={item.id}>
            <div className="product-images">
              <img
                src={
                  item.product.images && item.product.images.length > 0
                    ? (item.product.images[0].startsWith("/")
                        ? item.product.images[0]
                        : `/images/${item.product.images[0]}`)
                    : "/placeholder.png"
                }
                alt={item.product.name}
                style={{ width: 50, height: 50, objectFit: "cover", marginRight: 4 }}
              />
            </div>
            <div className="product-info">
              <p>{item.product.name}</p>
              <p>{item.color}/{item.size}</p>
              <p>x{item.quantity}</p>
              <p>₪{item.product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderCard;
