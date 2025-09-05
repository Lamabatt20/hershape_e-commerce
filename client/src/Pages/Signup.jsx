import React, { useState } from "react";
import { signup } from "../api";
import { useNavigate, Link } from "react-router-dom";
import Footer from "../Components/Footer";
import "./Signup.css";
import hiddenIcon from "../assets/icons/eye-off 1.png"; 
import showIcon from "../assets/icons/eye 1.png"; 

export default function Signup() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signup(form);
    if (res.error) {
      setMessage(res.error);
      setError(true);
    } else {
      setMessage(res.message);
      setError(false);
      navigate("/verify", { state: { email: form.email } });
    }
  };

  return (
    <>
      <div className="signup-page">
        <div className="signup-card">
          <h2 className="signup-title">
            Sign up <span className="brand-name">her shape.</span>
          </h2>
          <p className="signup-subtitle">
            Already have an account?{" "}
            <Link to="/login" className="signin-link">
              Log in
            </Link>
          </p>

          <form onSubmit={handleSubmit}>
            <input
              className="signup-input"
              name="username"
              placeholder="Your Name"
              value={form.username}
              onChange={handleChange}
              required
            />
            <input
              className="signup-input"
              name="email"
              placeholder="Your Email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />

           
            <div className="password-wrapper">
              <input
                className="signup-input password-input"
                name="password"
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                required
              />
             <img
                src={showPassword ? hiddenIcon : showIcon}
                alt="toggle password"
                className="password-toggle-icon"
                onClick={() => setShowPassword(!showPassword)}
                />
            </div>

            <div className="checkbox-container">
              <input type="checkbox" required />
              <span>I accept the terms of the Service & Privacy Policy.</span>
            </div>

            <button type="submit" className="signup-btn">
              Sign up
            </button>
          </form>

          {message && (
            <p
              className="signup-message"
              style={{ color: error ? "red" : "green" }}
            >
              {message}
            </p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
