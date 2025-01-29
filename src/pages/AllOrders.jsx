import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar/NavBar";
import jsPDF from "jspdf"; 
import "jspdf-autotable"; 
import "../App.css";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("https://menu-qdlu.onrender.com/api/orders");
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();

        // Merge orders from the backend with locally stored new orders
        const localOrders = JSON.parse(localStorage.getItem("newOrders")) || [];
        const mergedOrders = [...data, ...localOrders];
        
        setOrders(mergedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const generateInvoice = () => {
    const doc = new jsPDF();
    doc.text("Orders Invoice", 14, 16);
    doc.autoTable({
      head: [['Ticket ID', 'Customer Name', 'Phone Number', 'Payment Method', 'Items Ordered', 'Total Price', 'Time']],
      body: orders.map(order => [
        order.ticket_id,
        order.customer_name,
        order.phone_number,
        order.payment_method,
        order.items ? order.items.map(item => `${item.name} (x${item.quantity})`).join(", ") : "",
        `$${order.total_price?.toFixed(2) || "0.00"}`,
        new Date(order.timestamp).toLocaleString()
      ]),
    });
    doc.save("invoice.pdf");
  };

  return (
    <div>
      <Navbar />
      <div className="main-content">
        <div className="orders-container">
          <h1 className="orders-header">Orders Page</h1>
          <table className="orders-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Customer Name</th>
                <th>Phone Number</th>
                <th>Payment Method</th>
                <th>Items Ordered</th>
                <th>Total Price</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order, index) => (
                  <tr key={`${order.id}-${index}`}>
                    <td>{order.ticket_id}</td>
                    <td>{order.customer_name}</td>
                    <td>{order.phone_number}</td>
                    <td>{order.payment_method}</td>
                    <td>
                      {order.items ? order.items.map((item) => (
                        <p key={`${item.id}-${index}`}>
                          {item.name} (x{item.quantity})
                        </p>
                      )) : ""}
                    </td>
                    <td>${order.total_price?.toFixed(2) || "0.00"}</td>
                    <td>{new Date(order.timestamp).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
          <button onClick={generateInvoice} className="generate-invoice-button">
            Generate Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllOrders;
