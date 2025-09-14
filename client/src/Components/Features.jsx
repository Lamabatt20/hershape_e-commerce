import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "./Features.css";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

import shaperImg from "../assets/images/shaper.png";
import packingImg from "../assets/images/packing.png";
import supportImg from "../assets/images/support.png";

const features = [
  {
    img: shaperImg,
    title: {
      en: "lasting comfort",
      ar: "راحة تدوم طويلًا",
    },
    description: {
      en: "Feel comfortable and beautiful with Her Shape shaper, designed for all day wear and more appeal",
      ar: "اشعري بالراحة والجمال مع مشد هير شيب المصمم لارتداء يدوم طوال اليوم ويزيد من جاذبيتك",
    },
  },
  {
    img: packingImg,
    title: {
      en: "special packaging",
      ar: "تغليف مميز",
    },
    description: {
      en: "Carefully and distinctively packaged",
      ar: "تغليف بعناية وبطريقة مميزة",
    },
  },
  {
    img: supportImg,
    title: {
      en: "customer support",
      ar: "دعم العملاء",
    },
    description: {
      en: "Always here to assist you anytime",
      ar: "دائمًا هنا لمساعدتك في أي وقت",
    },
  },
];

const Features = () => {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const lang = localStorage.getItem("language") || "en";
    setLanguage(lang);

    const handleLangChange = () => {
      const updatedLang = localStorage.getItem("language") || "en";
      setLanguage(updatedLang);
    };

    window.addEventListener("storageLanguageChanged", handleLangChange);

    return () => {
      window.removeEventListener("storageLanguageChanged", handleLangChange);
    };
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1200,
    pauseOnHover: true,
    adaptiveHeight: true,
  };

  return (
    <div className="features-carousel-container">
      <Slider {...settings}>
        {features.map((feature, index) => (
          <div key={index} className="feature-item">
            <img src={feature.img} alt={feature.title[language]} className="feature-icon" />
            <h3 className="feature-title">{feature.title[language]}</h3>
            <p className="feature-description">{feature.description[language]}</p>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Features;
