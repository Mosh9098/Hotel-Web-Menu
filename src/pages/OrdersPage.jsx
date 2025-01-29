import React, { useEffect, useState } from "react";
import HomeNav from "../components/Navbar/HomeNav";
import "../App.css";

const OrdersPage = () => {
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

  const handlePrintReceipt = (order) => {
    const receiptWindow = window.open("", "PRINT", "height=400,width=600");
    receiptWindow.document.write(`
      <html>
        <head>
          <title>Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; }
            .receipt-container { width: 100%; max-width: 600px; margin: 0 auto; }
            .receipt-header { text-align: center; margin-bottom: 20px; }
            .receipt-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .receipt-table th, .receipt-table td { padding: 10px; border: 1px solid #ddd; text-align: left; }
            .receipt-footer { text-align: center; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            <h1 class="receipt-header">Receipt</h1>
            <table class="receipt-table">
              <tr>
                <th>Ticket ID</th>
                <td>${order.ticket_id}</td>
              </tr>
              <tr>
                <th>Customer Name</th>
                <td>${order.customer_name}</td>
              </tr>
              <tr>
                <th>Phone Number</th>
                <td>${order.phone_number}</td>
              </tr>
              <tr>
                <th>Payment Method</th>
                <td>${order.payment_method}</td>
              </tr>
              <tr>
                <th>Items Ordered</th>
                <td>${order.items ? order.items.map(item => `${item.name} (x${item.quantity})`).join(", ") : ""}</td>
              </tr>
              <tr>
                <th>Total Price</th>
                <td>$${order.total_price?.toFixed(2) || "0.00"}</td>
              </tr>
              <tr>
                <th>Date & Time</th>
                <td>${new Date(order.timestamp).toLocaleString()}</td>
              </tr>
            </table>
            <div class="receipt-footer">
              <p>Thank you for your order!</p>
            </div>
          </div>
        </body>
      </html>
    `);
    receiptWindow.document.close();
    receiptWindow.print();
  };

  return (
    <div>
      <HomeNav />
      <h1>Orders Page</h1>
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
            <th>Actions</th>
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
                <td>
                  <button onClick={() => handlePrintReceipt(order)}>
                    Print Receipt
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No orders found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersPage;
