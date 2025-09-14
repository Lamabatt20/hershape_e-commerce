import React, { useState, useEffect } from "react";
import { login } from "../api";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Footer from "../Components/Footer";
import "./Login.css";

import eyeIcon from "../assets/icons/eye 1.png";
import eyeOffIcon from "../assets/icons/eye-off 1.png";

const translations = {
  en: {
    loginTitle: "Login",
    brandName: "her shape.",
    noAccount: "Don’t have an account?",
    signUp: "Sign Up",
    emailPlaceholder: "Enter your email",
    passwordPlaceholder: "Enter your password",
    loginButton: "Login",
    somethingWentWrong: "Something went wrong. Please try again.",
  },
  ar: {
    loginTitle: "تسجيل الدخول",
    brandName: "her shape.",
    noAccount: "ليس لديك حساب؟",
    signUp: "إنشاء حساب",
    emailPlaceholder: "أدخل بريدك الإلكتروني",
    passwordPlaceholder: "أدخل كلمة المرور",
    loginButton: "تسجيل الدخول",
    somethingWentWrong: "حدث خطأ، الرجاء المحاولة مجدداً.",
  },
};

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
    document.documentElement.lang = storedLang;
    document.documentElement.dir = storedLang === "ar" ? "rtl" : "ltr";

    
    const handleLangChange = () => {
      const updatedLang = localStorage.getItem("language") || "en";
      setLanguage(updatedLang);
      document.documentElement.lang = updatedLang;
      document.documentElement.dir = updatedLang === "ar" ? "rtl" : "ltr";
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
      setMessage(translations[language].somethingWentWrong);
      console.error(error);
    }
  };

  return (
    <>
      <div className="login-page" dir={language === "ar" ? "rtl" : "ltr"}>
        <div className="login-card">
          <h2 className="login-title">
            {translations[language].loginTitle}{" "}
            <span className="brand-name">{translations[language].brandName}</span>
          </h2>

          <p className="login-subtitle">
            {translations[language].noAccount}{" "}
            <Link to="/signup" className="signup-link">
              {translations[language].signUp}
            </Link>
          </p>

          <form onSubmit={handleSubmit}>
            <input
              className="login-input"
              name="email"
              placeholder={translations[language].emailPlaceholder}
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <div className="password-wrapper">
              <input
                className="login-input password-input"
                name="password"
                placeholder={translations[language].passwordPlaceholder}
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
                style={{ cursor: "pointer" }}
              />
            </div>

            <button type="submit" className="login-btn">
              {translations[language].loginButton}
            </button>
          </form>

          {message && <p className="login-message">{message}</p>}
        </div>
      </div>
      <Footer />
    </>
  );
}
