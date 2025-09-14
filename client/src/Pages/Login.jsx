import React, { useState, useEffect } from "react";
import { login } from "../api";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Footer from "../Components/Footer";
import "./Login.css";

import eyeIcon from "../assets/icons/eye 1.png";
import eyeOffIcon from "../assets/icons/eye-off 1.png";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [language, setLanguage] = useState("en");

  const from = location.state?.from || "/";

 
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(form);

      if (res.error) {
        setMessage(res.error);
      } else {
        const user = res.user;
        const customer = user.customer || { id: null };

        const userWithCustomer = {
          id: user.id,
          name: user.name || user.username,
          email: user.email,
          role: user.role,
          image: user.image || "",
          customer,
        };

        localStorage.setItem("userId", user.id);
        localStorage.setItem("customerId", customer.id);
        localStorage.setItem("user", JSON.stringify(userWithCustomer));

        window.dispatchEvent(new Event("storageUserChanged"));

        if (user.role === "admin") {
          navigate("/dashboard", { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      }
    } catch (error) {
      setMessage(
        language === "en"
          ? "Something went wrong. Please try again."
          : "حدث خطأ ما. حاول مرة أخرى."
      );
      console.error(error);
    }
  };

  return (
    <>
      <div className="login-page">
        <div className="login-card">
          <h2 className="login-title">
            {language === "en" ? "Login" : "تسجيل الدخول"}{" "}
            <span className="brand-name">her shape.</span>
          </h2>

          <p className="login-subtitle">
            {language === "en" ? "Don’t have an account?" : "ما عندك حساب؟"}{" "}
            <Link to="/siginup" className="signup-link">
              {language === "en" ? "Sign Up" : "إنشاء حساب"}
            </Link>
          </p>

          <form onSubmit={handleSubmit}>
            <input
              className="login-input"
              name="email"
              placeholder={
                language === "en"
                  ? "Enter your email"
                  : "أدخل البريد الإلكتروني"
              }
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <div className="password-wrapper">
              <input
                className="login-input password-input"
                name="password"
                placeholder={
                  language === "en"
                    ? "Enter your password"
                    : "أدخل كلمة المرور"
                }
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                required
              />
              <img
                src={showPassword ? eyeOffIcon : eyeIcon}
                alt="toggle password"
                className="password-toggle-icon"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>

            <button type="submit" className="login-btn">
              {language === "en" ? "Login" : "دخول"}
            </button>
          </form>

          {message && <p className="login-message">{message}</p>}
        </div>
      </div>
      <Footer />
    </>
  );
}
