import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AppContext from "../Context/Context";
import { getProductImageUrl } from "../config";

const Home = ({ selectedCategory }) => {
  const { data, isError, addToCart } = useContext(AppContext);

  const products = data.map((product) => ({
    ...product,
    imageUrl: getProductImageUrl(product.id),
  }));

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  if (isError) {
    return (
      <div className="state-message">
        <h2>Something went wrong...</h2>
        <p>Make sure the backend is running on http://localhost:8080</p>
      </div>
    );
  }

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <span className="hero-eyebrow">New Arrivals</span>
          <h1>Everything you need, all in one cart.</h1>
          <p>
            Handpicked electronics, fashion and everyday essentials — with
            fast checkout and real-time stock tracking.
          </p>
        </div>
      </section>

      <section className="product-section">
        <div className="section-heading">
          <h2>{selectedCategory ? selectedCategory : "All Products"}</h2>
          <span className="product-count">
            {filteredProducts.length} item{filteredProducts.length !== 1 && "s"}
          </span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="state-message">
            <h3>No products available</h3>
            <p>Try a different category or add a new product.</p>
          </div>
        ) : (
          <div className="grid">
            {filteredProducts.map((product) => {
              const { id, brand, name, price, available, imageUrl } = product;

              return (
                <div className={`product-card ${!available ? "out-of-stock" : ""}`} key={id}>
                  <Link to={`/product/${id}`} className="product-card-link">
                    <div className="product-card-image">
                      <img
                        src={imageUrl}
                        alt={name}
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/400x400?text=No+Image";
                        }}
                      />
                      {!available && <span className="stock-tag">Out of Stock</span>}
                    </div>

                    <div className="product-card-body">
                      <span className="product-brand">{brand}</span>
                      <h3 className="product-name">{name}</h3>
                      <div className="product-price">${price}</div>
                    </div>
                  </Link>

                  <button
                    className="btn-add-to-cart"
                    disabled={!available}
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart(product);
                    }}
                  >
                    {available ? "Add to Cart" : "Out of Stock"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
