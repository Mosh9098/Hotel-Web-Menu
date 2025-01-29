import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/Navbar/HomeNav";
import "../App.css";
import { QRCodeCanvas } from "qrcode.react"; 

const Cart = () => {
  const [chosenItems, setChosenItems] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+254"); // Default to Kenya
  const [paymentMethod, setPaymentMethod] = useState("");
  const [creditCardNumber, setCreditCardNumber] = useState("");
  const [creditCardPassword, setCreditCardPassword] = useState("");
  const [ticketId, setTicketId] = useState(1); // Auto-generate sequentially
  const [isCartOpen, setIsCartOpen] = useState(false); // State to handle cart visibility
  const navigate = useNavigate();

  useEffect(() => {
    const storedItems = localStorage.getItem("cartItems");
    if (storedItems) {
      setChosenItems(JSON.parse(storedItems));
    }

    const lastTicketId = localStorage.getItem("lastTicketId");
    setTicketId(lastTicketId ? parseInt(lastTicketId) + 1 : 1);
  }, []);

  useEffect(() => {
    localStorage.setItem("lastTicketId", ticketId);
  }, [ticketId]);

  const calculateTotalPrice = (items) => {
    if (!items || !Array.isArray(items)) {
      return 0;
    }
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handlePlaceOrder = async () => {
    if (!customerName || !phoneNumber) {
      alert("Please fill in all required details.");
      return;
    }

    try {
      const userId = localStorage.getItem("userId") || "defaultUserId";

      const orderItems = chosenItems.map((item) => ({
        menuitem_id: item.id,
        quantity: item.quantity,
      }));

      const orderData = {
        user_id: userId,
        order_items: orderItems,
        customer_name: customerName,
        ticket_id: ticketId,
        phone_number: `${countryCode}${phoneNumber}`,
        payment_method: paymentMethod,
        credit_card_number: paymentMethod === "Credit Card" ? creditCardNumber : null,
      };

      const response = await fetch("https://menu-qdlu.onrender.com/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const responseBody = await response.json();
      console.log("Response Status:", response.status);
      console.log("Response Body:", responseBody);

      setChosenItems([]);
      localStorage.removeItem("cartItems");
      alert("Order placed successfully!");

      navigate("/orders"); // Redirect to OrdersPage after placing order
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Error placing order. Please try again.");
    }
  };

  const handleRemoveItem = (itemId) => {
    const updatedItems = chosenItems.filter((item) => item.id !== itemId);
    setChosenItems(updatedItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedItems));
  };

  const handleIncreaseQuantity = (itemId) => {
    const updatedItems = chosenItems.map((item) => {
      if (item.id === itemId) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    setChosenItems(updatedItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedItems));
  };

  const handleDecreaseQuantity = (itemId) => {
    const updatedItems = chosenItems.map((item) => {
      if (item.id === itemId) {
        return { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 };
      }
      return item;
    });
    setChosenItems(updatedItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedItems));
  };

  return (
    <div>
      <NavBar />
      <button className="open-cart-btn" onClick={() => setIsCartOpen(!isCartOpen)}>Toggle Cart</button>
      <div className={`cart-popout ${isCartOpen ? "open" : ""}`}>
        <div className="cart-header">
          <h3 className="cart-title">Cart Items</h3>
          <button className="close-cart-btn" onClick={() => setIsCartOpen(false)}>✖</button>
        </div>
        <div className="cart-items">
          <table className="cart-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {chosenItems.length > 0 ? (
                chosenItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="cart-food-image"
                      />
                    </td>
                    <td>{item.name}</td>
                    <td>
                      <button
                        onClick={() => handleDecreaseQuantity(item.id)}
                        className="quantity-btn"
                      >
                        ➖
                      </button>
                      {item.quantity}
                      <button
                        onClick={() => handleIncreaseQuantity(item.id)}
                        className="quantity-btn"
                      >
                        ➕
                      </button>
                    </td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                    <td>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="remove-btn"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="empty-cart-message">
                    Your cart is empty.
                  </td>
                </tr>
              )}
            </tbody>
            {chosenItems.length > 0 && (
              <tfoot>
                <tr>
                  <td colSpan="5" className="total-label">
                    Total Price:
                  </td>
                  <td className="total-price">
                    ${calculateTotalPrice(chosenItems).toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>

          {chosenItems.length > 0 && (
            <div className="customer-details">
              <h3>Customer Details</h3>
              <label>
                Name:
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </label>
              <label>
                Ticket ID:
                <input type="text" value={ticketId} readOnly />
              </label>
              <label>
                Phone Number:
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                >
                  <option value="+254">Kenya (+254)</option>
                  <option value="+1">USA (+1)</option>
                  <option value="+44">UK (+44)</option>
                  {/* Add more countries here */}
                </select>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </label>
              <label>
                Payment Method:
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="Cash">Cash</option>
                  <option value="Credit Card">Credit Card</option>
                </select>
              </label>
              {paymentMethod === "Credit Card" && (
                <>
                  <label>
                    Credit Card Number:
                    <input
                      type="text"
                      value={creditCardNumber}
                      onChange={(e) => setCreditCardNumber(e.target.value)}
                    />
                  </label>
                  <label>
                    Credit Card Password:
                    <input
                      type="password"
                      value={creditCardPassword}
                      onChange={(e) => setCreditCardPassword(e.target.value)}
                    />
                  </label>
                  <div className="credit-card-icons">
                    <img src="/path/to/visa-icon.png" alt="Visa" />
                    <img src="/path/to/mastercard-icon.png" alt="MasterCard" />
                    <img src="/path/to/amex-icon.png" alt="American Express" />
                    <img src="/path/to/paypal-icon.png" alt="PayPal" />
                    {/* Add more icons as needed */}
                  </div>
                </>
              )}
              <div className="qr-code">
                <h3>QR Code</h3>
                <QRCodeCanvas value={`${customerName}-${ticketId}`} />
              </div>
            </div>
          )}

          <button className="place-order-btn" onClick={handlePlaceOrder}>
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
