import React, { useEffect, useState } from "react";
import "./Contact.css";

import facebookIcon from "../assets/icons/icons8-facebook-48.png";
import instagramIcon from "../assets/icons/Instagram (1).png";
import snapchatIcon from "../assets/icons/snap.png";
import locationIcon from "../assets/icons/loc.png";
import phoneIcon from "../assets/icons/whats.png";
import emailIcon from "../assets/icons/email.png";
import Footer from "../Components/Footer";
import contactIcon from "../assets/icons/image.png";

export default function Contact() {
  const [language, setLanguage] = useState("en");

  const translations = {
    en: {
      getInTouch: "Get In Touch",
      subtitle:
        "If you have any questions or would like to know more about our products, delivery options, or order details",
      location: "Ramallah, Palestine",
      phone: "+972 592743619",
      email: "Larashareef@hotmail.com",
    },
    ar: {
      getInTouch: "تواصل معنا",
      subtitle:
        "إذا كان لديك أي أسئلة أو ترغب في معرفة المزيد عن منتجاتنا، خيارات التوصيل، أو تفاصيل الطلب",
      location: "رام الله، فلسطين",
      phone: "+972 592743619",
      email: "Larashareef@hotmail.com",
    },
  };

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

  return (
    <>
      <div className="contact-page" dir={language === "ar" ? "rtl" : "ltr"}>
        <div className="contact-card">
          <h2 className="contact-title">
            <img
              src={contactIcon}
              alt="Contact Icon"
              className="contact-title-icon"
            />
            {translations[language].getInTouch}
          </h2>
          <p className="contact-subtitle">{translations[language].subtitle}</p>
          <div className="contact-cards">
            <div className="contact-info">
              <div className="info-item">
                <img src={locationIcon} alt="Location" className="info-icon" />
                <span>{translations[language].location}</span>
              </div>
              <div className="info-item">
                <img src={phoneIcon} alt="Phone" className="info-icon" />
                <span className="support-info">
                  <a
                    href="https://wa.me/972592743619"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {translations[language].phone}
                  </a>
                </span>
              </div>
              <div className="info-item">
                <img src={emailIcon} alt="Email" className="info-icon" />
                <span className="support-info">
                  <a href="mailto:Larashareef@hotmail.com">
                    {translations[language].email}
                  </a>
                </span>
              </div>
            </div>

            <div className="contact-icons">
              <a
                href="https://www.facebook.com/share/17DxDQhcJi/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={facebookIcon} alt="Facebook" className="icon" />
              </a>
              <a
                href="https://www.instagram.com/her_shape?igsh=MTM4MDRjaG9ocjJ1ag=="
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={instagramIcon} alt="Instagram" className="icon" />
              </a>
              <a
                href="https://www.snapchat.com/add/larahijjawi"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={snapchatIcon} alt="Snapchat" className="icon" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
