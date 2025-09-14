import React, { useState, useEffect } from "react";
import OrderCard from "./OrderCard";
import Footer from "../Components/Footer";
import { getUserOrders } from "../api";
import "./Orders.css";

const Profile = () => {
  const [orders, setOrders] = useState([]);
  const [language, setLanguage] = useState("en");
  const customerId = localStorage.getItem("userId");

  useEffect(() => {
    const storedLang = localStorage.getItem("language") || "en";
    setLanguage(storedLang);

    const handleLangChange = () => {
      const updatedLang = localStorage.getItem("language") || "en";
      setLanguage(updatedLang);
    };

    window.addEventListener("storageLanguageChanged", handleLangChange);

    return () => {
      window.removeEventListener("storageLanguageChanged", handleLangChange);
    };
  }, []);

 
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
        <h1>{language === "en" ? "My Orders" : "طلباتي"}</h1>

        <div className="orders-list">
          {orders.length > 0 ? (
            orders.map((order) => <OrderCard key={order.id} order={order} />)
          ) : (
            <p>
              {language === "en" ? "No orders yet." : "لا يوجد طلبات بعد."}
            </p>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Profile;
