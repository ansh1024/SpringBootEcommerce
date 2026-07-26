import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import API from "../axios";
import AppContext from "../Context/Context";

const Navbar = ({ onSelectCategory }) => {
  const { cart } = useContext(AppContext);

  const getInitialTheme = () => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? storedTheme : "light-theme";
  };

  const [activeCategory, setActiveCategory] = useState("");
  const [theme, setTheme] = useState(getInitialTheme());
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleChange = async (value) => {
    setInput(value);
    if (value.length >= 1) {
      setShowSearchResults(true);
      try {
        const response = await API.get(
          `/products/search?keyword=${encodeURIComponent(value)}`,
        );
        setSearchResults(response.data);
        setNoResults(response.data.length === 0);
      } catch (error) {
        console.error("Error searching:", error);
      }
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
      setNoResults(false);
    }
  };

  const handleCategorySelect = (category) => {
    const next = category === activeCategory ? "" : category;
    setActiveCategory(next);
    onSelectCategory(next);
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark-theme" ? "light-theme" : "dark-theme";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const categories = [
    "Laptop",
    "Headphone",
    "Mobile",
    "Electronics",
    "Toys",
    "Fashion",
  ];

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header>
      <nav className="navbar navbar-expand-lg fixed-top">
        <div className="container-fluid nav-inner">
          <Link className="navbar-brand" to="/">
            <i className="bi bi-bag-check-fill"></i> MegaCart
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink className="nav-link" to="/" end>
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/add_product">
                  Add Product
                </NavLink>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  onClick={(e) => e.preventDefault()}
                >
                  Categories
                </a>
                <ul className="dropdown-menu">
                  {categories.map((category) => (
                    <li key={category}>
                      <button
                        className={`dropdown-item ${activeCategory === category ? "is-active" : ""}`}
                        onClick={() => handleCategorySelect(category)}
                      >
                        {category}
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>

            <div className="nav-search">
              <i className="bi bi-search search-icon"></i>
              <input
                className="form-control"
                type="search"
                placeholder="Search products..."
                aria-label="Search"
                value={input}
                onChange={(e) => handleChange(e.target.value)}
                onBlur={() => setTimeout(() => setShowSearchResults(false), 150)}
                onFocus={() => input.length >= 1 && setShowSearchResults(true)}
              />
              {showSearchResults && (
                <ul className="list-group">
                  {searchResults.length > 0
                    ? searchResults.map((result) => (
                        <li key={result.id} className="list-group-item">
                          <Link
                            to={`/product/${result.id}`}
                            className="search-result-link"
                            onClick={() => setShowSearchResults(false)}
                          >
                            {result.name}
                          </Link>
                        </li>
                      ))
                    : noResults && (
                        <li className="list-group-item no-results-message">
                          No product with that name
                        </li>
                      )}
                </ul>
              )}
            </div>

            <button className="theme-btn" onClick={toggleTheme} title="Toggle theme">
              {theme === "dark-theme" ? (
                <i className="bi bi-sun-fill"></i>
              ) : (
                <i className="bi bi-moon-fill"></i>
              )}
            </button>

            <Link to="/cart" className="cart-link">
              <i className="bi bi-cart3"></i>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
