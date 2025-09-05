import "./Footer.css";


import logoUrl from "../assets/images/logo.png";
import facebookUrl from "../assets/icons/f.png";
import instagramUrl from "../assets/icons/Instagram.png";
import snapchatUrl from "../assets/icons/s.png";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <img src={logoUrl} alt="Her Shape" className="footer-logo" />

        <p className="footer-rights">
          © 2025 Her Shape. All Rights Reserved
        </p>

        <div className="footer-support">
          <span className="footer-support-title">Support</span>
          <span className="footer-support-info">
            <a
              href="https://wa.me/972592743619"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp +972 592743619
            </a>
          </span>
        </div>
      </div>

      
      <div className="footer-divider"></div>

     
      <div className="footer-content">
        <div className="footer-icons">
          <a href="https://www.facebook.com/share/17DxDQhcJi/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer">
            <img src={facebookUrl} alt="Facebook" />
          </a>
          <a href="https://www.instagram.com/her_shape?igsh=MTM4MDRjaG9ocjJ1ag==" target="_blank" rel="noopener noreferrer">
            <img src={instagramUrl} alt="Instagram" />
          </a>
          <a href="https://www.snapchat.com/add/larahijjawi" target="_blank" rel="noopener noreferrer">
            <img src={snapchatUrl} alt="Snapchat" />
          </a>
        </div>
      </div>
    </footer>
  );
}
