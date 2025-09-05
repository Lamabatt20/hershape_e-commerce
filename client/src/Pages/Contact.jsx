import React from "react";
import "./Contact.css";


import facebookIcon from "../assets/icons/Facebook.png";
import instagramIcon from "../assets/icons/Instagram (1).png";
import snapchatIcon from "../assets/icons/snap.png";
import locationIcon from "../assets/icons/loc.png";
import phoneIcon from "../assets/icons/whats.png";
import emailIcon from "../assets/icons/email.png";
import Footer from "../Components/Footer";

export default function Contact() {
  return (
    <>
    <div className="contact-page">
      <div className="contact-card">
        <h2 className="contact-title">Get In Touch</h2>
        <p className="contact-subtitle">
          If you have any questions or would like to know more about our products, delivery options, or order details
        </p>
        <div className="contact-cards">
        <div className="contact-info">
          <div className="info-item">
            <img src={locationIcon} alt="Location" className="info-icon" />
            <span>Ramallah, Palestine</span>
          </div>
          <div className="info-item">
            <img src={phoneIcon} alt="Phone" className="info-icon" />
            <span className="support-info"> <a
              href="https://wa.me/972592743619"
              target="_blank"
              rel="noopener noreferrer"
            >
             +972 592743619
            </a></span>
          </div>
          <div className="info-item">
            <img src={emailIcon} alt="Email" className="info-icon" />
            <span>hello@info.com</span>
          </div>
        </div>

        <div className="contact-icons">
          <a href="https://www.facebook.com/share/17DxDQhcJi/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer">
            <img src={facebookIcon} alt="Facebook" className="icon" />
          </a>
          <a href="https://www.instagram.com/her_shape?igsh=MTM4MDRjaG9ocjJ1ag==" target="_blank" rel="noopener noreferrer">
            <img src={instagramIcon} alt="Instagram" className="icon" />
          </a>
          <a href="https://www.snapchat.com/add/larahijjawi" target="_blank" rel="noopener noreferrer">
            <img src={snapchatIcon} alt="Snapchat" className="icon" />
          </a>
        </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}
