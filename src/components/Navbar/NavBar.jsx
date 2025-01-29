import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/"); // Redirect to login page
  };

  return (
    <nav className="sidebar">
      <ul>
        <li>
          <Link to="/menu-table" className={window.location.pathname === "/menu-table" ? "active" : ""}>
            Menu
          </Link>
        </li>
        <li>
          <Link to="/menu-list" className={window.location.pathname === "/menu-list" ? "active" : ""}>
            Menu List
          </Link>
        </li>
        <li>
          <Link to="/all-orders" className={window.location.pathname === "/all-orders" ? "active" : ""}>
            Orders
          </Link>
        </li>
        <li>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
