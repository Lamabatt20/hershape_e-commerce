import React from "react";
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
    title: "lasting comfort",
    description:
      "Feel comfortable and beautiful with Her Shape shaper, designed for all day wear and more appeal",
  },
  {
    img: packingImg,
    title: "special packaging",
    description: "Carefully and distinctively packaged",
  },
  {
    img: supportImg,
    title: "customer support",
    description: "Always here to assist you anytime",
  },
];

const Features = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,         // تفعيل الحركة التلقائية
    autoplaySpeed: 1200,    // كل 3 ثواني تنتقل
    pauseOnHover: true,        // إخفاء الأسهم (اختياري)
    adaptiveHeight: true,
  };

  return (
    <div className="features-carousel-container">
      <Slider {...settings}>
        {features.map((feature, index) => (
          <div key={index} className="feature-item">
            <img src={feature.img} alt={feature.title} className="feature-icon" />
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Features;
