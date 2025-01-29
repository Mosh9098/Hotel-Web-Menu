import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginPage = () => {
  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("admin2024");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (email !== "admin@gmail.com" || password !== "admin2024") {
      alert("Invalid email or password.");
      return;
    }
    navigate("/menu-table");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="landing-page">
      <div className="login-container">
        <h1>Welcome! <br />Keep your data safe.</h1>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail("admin@gmail.com")}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword("admin2024")}
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        <button className="login-button" onClick={handleLogin}>
          LOGIN
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
