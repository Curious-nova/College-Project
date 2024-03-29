import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    // Validation
    if (!email || !password || !userName) {
      setError("All fields are required");
      return;
    }

    // Send registration data to the backend
    axios
      .post("http://localhost:8080/register", {
        username: userName,
        email,
        password,
      })
      .then((res) => {
        console.log(res.data); // Log response from the backend
        if (res.data.status === "success") {
          navigate("/login"); // Redirect to login page on successful registration
        } else {
          alert("Failed to register ");
        }
      })
      .catch((err) => console.log(err)); // Log any errors

    // Reset form fields
    setUserName("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div
        className="card p-4 shadow"
        style={{ minWidth: "320px", backgroundColor: "#f8f9fa" }}
      >
        <h2 className="text-center mb-4" style={{ color: "#007bff" }}>
          Register
        </h2>
        <form onSubmit={handleRegister}>
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

          <button
            type="submit"
            className="btn btn-primary btn-block"
            style={{ backgroundColor: "#007bff", borderColor: "#007bff" }}
          >
            Register
          </button>
        </form>
        <div>
          <p>
            Already Registered? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

// export default Register;
