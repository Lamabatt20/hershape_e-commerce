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

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const inputsRef = useRef([]);

  
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
      setMessage("Please enter the 4-digit code");
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
      setMessage("Verification code resent successfully.");
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
            <h2>Verify Your Code</h2>
            <p>we sent a code to</p>
            <strong>{email}</strong>
          </div>

          <form className="verify-form" onSubmit={handleSubmit}>
            <label className="verify-label">Enter 4-digit Code</label>
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
              Verify code
            </button>
          </form>

          <p className="timer-text">
            Time remaining: {formatTime(timeLeft)}
          </p>

          {canResend && (
            <button onClick={handleResend} className="resend-btn">
              Resend Code
            </button>
          )}

          {message && <p className="verify-message">{message}</p>}
        </div>
      </div>
      <Footer />
    </>
  );
}
