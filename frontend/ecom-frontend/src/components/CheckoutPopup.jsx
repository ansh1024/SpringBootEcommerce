import React from "react";
import { Modal, Button } from "react-bootstrap";

const CheckoutPopup = ({ show, handleClose, cartItems, totalPrice, handleCheckout, isCheckingOut }) => {
  return (
    <Modal show={show} onHide={handleClose} centered className="checkout-modal">
      <Modal.Header closeButton>
        <Modal.Title>Confirm Your Order</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="checkout-items">
          {cartItems.map((item) => (
            <div key={item.id} className="checkout-item">
              <img
                src={item.imageUrl}
                alt={item.name}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/80?text=No+Image";
                }}
              />
              <div className="checkout-item-info">
                <strong>{item.name}</strong>
                <span>Qty: {item.quantity}</span>
              </div>
              <span className="checkout-item-price">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
          <div className="checkout-total">
            <span>Total</span>
            <span>${totalPrice}</span>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={handleClose} disabled={isCheckingOut}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleCheckout} disabled={isCheckingOut}>
          {isCheckingOut ? "Placing Order..." : "Confirm Purchase"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CheckoutPopup;
