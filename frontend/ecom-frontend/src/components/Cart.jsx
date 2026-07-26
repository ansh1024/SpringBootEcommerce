import React, { useContext, useState, useEffect } from "react";
import AppContext from "../Context/Context";
import API from "../axios";
import { getProductImageUrl } from "../config";
import CheckoutPopup from "./CheckoutPopup.jsx";
import { Button } from "react-bootstrap";

const Cart = () => {
  const { cart, removeFromCart, clearCart, refreshData } = useContext(AppContext);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Keep the cart in sync with the backend: drop items that no longer
  // exist, and attach a display image URL + the true stock count.
  useEffect(() => {
    const syncCartWithBackend = async () => {
      try {
        const response = await API.get("/products");
        const backendProducts = response.data;
        const backendById = new Map(backendProducts.map((p) => [p.id, p]));

        const syncedItems = cart
          .filter((item) => backendById.has(item.id))
          .map((item) => {
            const backendProduct = backendById.get(item.id);
            return {
              ...item,
              stockQuantity: item.stockQuantity ?? backendProduct.quantity,
              imageUrl: getProductImageUrl(item.id),
            };
          });

        setCartItems(syncedItems);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    if (cart.length) {
      syncCartWithBackend();
    } else {
      setCartItems([]);
    }
  }, [cart]);

  useEffect(() => {
    const total = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  }, [cartItems]);

  const handleIncreaseQuantity = (itemId) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        if (item.quantity >= item.stockQuantity) {
          alert("Cannot add more than available stock");
          return item;
        }
        return { ...item, quantity: item.quantity + 1 };
      })
    );
  };

  const handleDecreaseQuantity = (itemId) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
          : item
      )
    );
  };

  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId);
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      for (const item of cartItems) {
        const { imageUrl, quantity: cartQuantity, stockQuantity, ...productFields } = item;
        const updatedQuantity = Math.max((stockQuantity ?? 0) - cartQuantity, 0);

        // productFields already carries the original imagename/imagetype/imagedate
        // from the backend response, so the image is preserved without needing
        // to re-upload a file on every checkout.
        const updatedProductData = { ...productFields, quantity: updatedQuantity };

        const formData = new FormData();
        formData.append(
          "product",
          new Blob([JSON.stringify(updatedProductData)], { type: "application/json" })
        );

        await API.put(`/products/${item.id}`, formData);
      }

      clearCart();
      setCartItems([]);
      setShowModal(false);
      refreshData();
      alert("Order placed successfully!");
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("Something went wrong during checkout. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="cart-page">
      <div className="shopping-cart">
        <div className="title">Shopping Bag</div>
        {cartItems.length === 0 ? (
          <div className="empty">
            <i className="bi bi-cart-x"></i>
            <h4>Your cart is empty</h4>
            <p>Browse products and add something you like.</p>
          </div>
        ) : (
          <>
            <ul className="cart-items">
              {cartItems.map((item) => (
                <li key={item.id} className="cart-item">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="cart-item-image"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/150?text=No+Image";
                    }}
                  />
                  <div className="description">
                    <span className="cart-item-brand">{item.brand}</span>
                    <span className="cart-item-name">{item.name}</span>
                  </div>

                  <div className="quantity">
                    <button
                      className="minus-btn"
                      type="button"
                      onClick={() => handleDecreaseQuantity(item.id)}
                    >
                      <i className="bi bi-dash-square-fill"></i>
                    </button>
                    <input type="button" value={item.quantity} readOnly />
                    <button
                      className="plus-btn"
                      type="button"
                      onClick={() => handleIncreaseQuantity(item.id)}
                    >
                      <i className="bi bi-plus-square-fill"></i>
                    </button>
                  </div>

                  <div className="total-price">${item.price * item.quantity}</div>
                  <button
                    className="remove-btn"
                    title="Remove from cart"
                    onClick={() => handleRemoveFromCart(item.id)}
                  >
                    <i className="bi bi-trash3-fill"></i>
                  </button>
                </li>
              ))}
            </ul>
            <div className="cart-summary">
              <div className="total">Total: <strong>${totalPrice}</strong></div>
              <Button
                className="checkout-btn"
                onClick={() => setShowModal(true)}
              >
                Proceed to Checkout
              </Button>
            </div>
          </>
        )}
      </div>
      <CheckoutPopup
        show={showModal}
        handleClose={() => setShowModal(false)}
        cartItems={cartItems}
        totalPrice={totalPrice}
        handleCheckout={handleCheckout}
        isCheckingOut={isCheckingOut}
      />
    </div>
  );
};

export default Cart;
