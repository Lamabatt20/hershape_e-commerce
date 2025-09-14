import React, { useState, useRef, useEffect } from "react";
import { verify, resendCode } from "../api"; 
import { useNavigate, useLocation } from "react-router-dom";
import Footer from "../Components/Footer";
import "./Verfiy.css";

export default function Verify() {
  const [code, setCode] = useState(["", "", "", ""]);
  const [message, setMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(16 * 60);
  const [canResend, setCanResend] = useState(false);
  const [language, setLanguage] = useState("en");

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const inputsRef = useRef([]);

  
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
    if (timeLeft === 0) {
      setCanResend(true);
      return;
    }
    const timerId = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleChange = (e, index) => {
    const val = e.target.value;
    if (/^\d?$/.test(val)) {
      const newCode = [...code];
      newCode[index] = val;
      setCode(newCode);

      if (val && index < 3) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullCode = code.join("");
    if (fullCode.length < 4) {
      setMessage(
        language === "en"
          ? "Please enter the 4-digit code"
          : "الرجاء إدخال الرمز المكون من 4 أرقام"
      );
      return;
    }
    const res = await verify({ email, code: fullCode });
    if (res.error) {
      setMessage(res.error);
    } else {
      setMessage(res.message);
      navigate("/login");
    }
  };

  const handleResend = async () => {
    setMessage("");
    const res = await resendCode({ email });
    if (res.error) {
      setMessage(res.error);
    } else {
      setMessage(
        language === "en"
          ? "Verification code resent successfully."
          : "تمت إعادة إرسال رمز التحقق بنجاح."
      );
      setTimeLeft(16 * 60);
      setCanResend(false);
      setCode(["", "", "", ""]);
      inputsRef.current[0].focus();
    }
  };

  return (
    <>
      <div className="verify-page">
        <div className="verify-card">
          <div className="verify-header">
            <h2>{language === "en" ? "Verify Your Code" : "تحقق من الرمز"}</h2>
            <p>
              {language === "en"
                ? "We sent a code to"
                : "لقد أرسلنا رمزًا إلى"}
            </p>
            <strong>{email}</strong>
          </div>

          <form className="verify-form" onSubmit={handleSubmit}>
            <label className="verify-label">
              {language === "en"
                ? "Enter 4-digit Code"
                : "أدخل الرمز المكون من 4 أرقام"}
            </label>
            <div className="code-inputs">
              {code.map((digit, i) => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  ref={(el) => (inputsRef.current[i] = el)}
                  className="code-input"
                  required
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="one-time-code"
                />
              ))}
            </div>
            <button type="submit" className="verify-btn">
              {language === "en" ? "Verify Code" : "تحقق من الرمز"}
            </button>
          </form>

          <p className="timer-text">
            {language === "en"
              ? "Time remaining:"
              : "الوقت المتبقي:"}{" "}
            {formatTime(timeLeft)}
          </p>

          {canResend && (
            <button onClick={handleResend} className="resend-btn">
              {language === "en" ? "Resend Code" : "إعادة إرسال الرمز"}
            </button>
          )}

          {message && <p className="verify-message">{message}</p>}
        </div>
      </div>
      <Footer />
    </>
  );
}
