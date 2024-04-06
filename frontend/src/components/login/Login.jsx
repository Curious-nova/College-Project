import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;
  const handleLogin = (e) => {
    e.preventDefault();

    // Send login data to the backend
    axios
      .post("http://localhost:8080/login", { email, password })
      .then((res) => {
        if (res.data.status === "success") {
          navigate("/");
          localStorage.setItem("userId", res.data.userId);
        } else {
          console.error("Login failed"); // Handle failed login
          alert("Failed to login");
        }
      })
      .catch((err) => {
        console.error("Error:", err); // Handle error
      });
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div
        className="card p-4 shadow mb-3"
        style={{ minWidth: "320px", backgroundColor: "#f8f9fa" }}
      >
        <h2 className="text-center mb-4" style={{ color: "#007bff" }}>
          Login
        </h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label style={{ color: "#495057" }}>Email address</label>
            <input
              type="email"
              className="form-control mb-3"
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
            className="btn btn-primary btn-block mb-3"
            style={{ backgroundColor: "#007bff", borderColor: "#007bff" }}
          >
            Submit
          </button>
        </form>
        <div>
          <p>
            Not Registered Yet? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

//export default Login;
