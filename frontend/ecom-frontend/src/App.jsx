import "./App.css";
import React, { useState } from "react";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Cart from "./components/Cart.jsx";
import AddProduct from "./components/AddProduct";
import Product from "./components/Product";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./Context/Context";
import UpdateProduct from "./components/UpdateProduct";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <span className="footer-brand">
            <i className="bi bi-bag-check-fill"></i> MegaCart
          </span>
          <p>A full-stack e-commerce demo built with React &amp; Spring Boot.</p>
        </div>
        <p className="footer-copy">
          &copy; {new Date().getFullYear()} MegaCart. Built for learning purposes.
        </p>
      </div>
    </footer>
  );
}

function App() {
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  return (
    <AppProvider>
      <BrowserRouter>
        <Navbar onSelectCategory={handleCategorySelect} />
        <div className="page-body">
          <Routes>
            <Route
              path="/"
              element={<Home selectedCategory={selectedCategory} />}
            />
            <Route path="/add_product" element={<AddProduct />} />
            <Route path="/product" element={<Product />} />
            <Route path="product/:id" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/product/update/:id" element={<UpdateProduct />} />
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
