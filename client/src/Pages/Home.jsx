import React from 'react';
import HeroSection from '../Components/HeroSection';
import Features from '../Components/Features';
import FeaturesProducts from '../Components/FeaturedProducts';
import VideoSection from '../Components/CorsetSection';
import Footer from '../Components/Footer';

function Home() {
  return (
    <div className="home-wrapper" style={{ backgroundColor: '#fcf8f0' }}>
      <HeroSection />

      <Features />
      <hr className="section-divider" />

      <FeaturesProducts />
      <hr className="section-divider" />

      <VideoSection />

      <Footer />

      <style jsx>{`
        .section-divider {
          border: none;
          border-top: 2px solid #d6c7b6;
          margin: 40px 0;
          width: 100%;
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
}

export default Home;
