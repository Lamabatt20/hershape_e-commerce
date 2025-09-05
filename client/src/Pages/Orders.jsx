
import React, { useState, useEffect } from "react";
import OrderCard from "./OrderCard";
import Footer from "../Components/Footer";
import { getUserOrders } from "../api";
import "./Orders.css";

const Profile = () => {
  const [orders, setOrders] = useState([]);
  const customerId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!customerId) return;
      const data = await getUserOrders(customerId);

      if (!data.error) {
        setOrders(data);
      } else {
        console.error("Error fetching orders:", data.error);
      }
    };

    fetchOrders();
  }, [customerId]);

  return (
    <>
      <div className="profile-page">
        <h1>My Orders</h1>

        <div className="orders-list">
          {orders.length > 0 ? (
            orders.map((order) => <OrderCard key={order.id} order={order} />)
          ) : (
            <p>No orders yet.</p>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Profile;
