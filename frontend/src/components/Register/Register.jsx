import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(30); // Countdown for resend button
  const [showResendButton, setShowResendButton] = useState(false); // To control the visibility of resend button
  const [isSendingOtp, setIsSendingOtp] = useState(false); // For spinner inside send OTP button
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (otpSent) {
      timer = setInterval(() => {
        setResendCountdown((prevCount) => (prevCount > 0 ? prevCount - 1 : 0));
      }, 1000);

      if (resendCountdown === 0) {
        setShowResendButton(true);
        clearInterval(timer);
      }
    }
    return () => clearInterval(timer);
  }, [otpSent, resendCountdown]);

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!email) {
      setError("Email is required to send OTP");
      return;
    }

    setIsSendingOtp(true);
    axios.post("http://localhost:8080/send-otp", { email })
      .then((res) => {
        setIsSendingOtp(false);
        if (res.data.Error) {
          setError(res.data.Error);
        } else {
          console.log(res.data);
          setOtpSent(true);
          setError(""); // Clear any previous error
          setSuccessMessage("");
          setResendCountdown(30);
          setShowResendButton(false);
        }
      })
      .catch((err) => {
        setIsSendingOtp(false);
        console.log(err);
        setError("Failed to send OTP");
      });
  };

  const handleResendOtp = (e) => {
    e.preventDefault();
    console.log(email);
    if (!email) {
      setError("Email is required to resend OTP");
      return;
    }

    axios.post("http://localhost:8080/resend-otp", { email })
      .then((res) => {
        if (res.data.Error) {
          setError(res.data.Error);
        } else {
          console.log(res.data);
          setSuccessMessage("OTP resent successfully");
          setError("");
          setOtpSent(true);
          setShowResendButton(false); // Hide resend button again
          setResendCountdown(30); // Reset countdown
        }
      })
      .catch((err) => {
        console.log(err);
        setError("Failed to resend OTP");
      });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!email || !password || !userName || !otp) {
      setError("All fields are required");
      return;
    }

    axios.post("http://localhost:8080/verify-otp", {
      email,
      username: userName,
      password,
      otp,
    })
      .then((res) => {
        if (res.data.status === "success") {
          navigate("/login");
        } else {
          setError(res.data.Error || "Failed to register, invalid OTP");
        }
      })
      .catch((err) => {
        console.log(err);
        setError("Failed to register");
      });

    setUserName("");
    setEmail("");
    setPassword("");
    setOtp("");
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ minWidth: "320px", backgroundColor: "#f8f9fa" }}>
        <h2 className="text-center mb-4" style={{ color: "#007bff" }}>
          Register
        </h2>
        {otpSent ? (
          <form onSubmit={handleRegister}>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            {successMessage && (
              <div className="alert alert-success" role="alert">
                {successMessage}
              </div>
            )}
            <div className="form-group mb-3">
              <label style={{ color: "#495057" }}>OTP</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block mx-1" style={{ backgroundColor: "#0056b3", borderColor: "#0056b3" }}>
              Verify OTP and Register
            </button>
            {showResendButton ? (
              <button onClick={handleResendOtp} className="btn btn-secondary btn-block mx-1" style={{ width: "auto", backgroundColor: "#dae0e5", borderColor: "#dae0e5", color: "#495057" }}>
                Resend OTP
              </button>
            ) : (
              <button className="btn btn-secondary btn-block mx-1" disabled style={{ width: "auto", backgroundColor: "#f8f9fa", borderColor: "#f8f9fa", color: "#ced4da" }}>
                Resend OTP ({resendCountdown})
              </button>
            )}
          </form>
        ) : (
          <form onSubmit={handleSendOtp}>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            <div className="form-group mb-3">
              <label style={{ color: "#495057" }}>Username</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label style={{ color: "#495057" }}>Email address</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label style={{ color: "#495057" }}>Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block" style={{ backgroundColor: "#007bff", borderColor: "#007bff" }}>
              {isSendingOtp ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              ) : (
                "Send OTP"
              )}
            </button>
          </form>
        )}
        <div>
          <p>Already Registered? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
};
