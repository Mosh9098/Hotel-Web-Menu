import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage";
import Cart from "./pages/Cart";
import MenuList from "./pages/MenuList";
import HomePage from "./pages/HomePage";
import AdminLogin from "./pages/Adminlogin";
import MenuTable from "./pages/MenuTable";
import OrdersPage from "./pages/OrdersPage";
import AllOrders from "./pages/AllOrders";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu-table" element={<MenuTable />} />
        <Route path="/main-page" element={<MainPage />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/menu-list" element={<MenuList />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/all-orders" element={<AllOrders />} />
      </Routes>
    </Router>
  );
}

export default App;
