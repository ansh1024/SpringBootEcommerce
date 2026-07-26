import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AppContext from "../Context/Context";

const Home = ({ selectedCategory }) => {
  const { data, isError, addToCart } = useContext(AppContext);

  const products = data.map((product) => ({
    ...product,
    // imageUrl: "https://via.placeholder.com/400x250?text=No+Image"
    imageUrl: `http://localhost:8080/api/products/${product.id}/image`,
  }));

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  if (isError) {
    return (
      <h2 className="text-center" style={{ padding: "10rem" }}>
        Something went wrong...
      </h2>
    );
  }

  return (
    <div className="grid">
      {filteredProducts.length === 0 ? (
        <h2
          className="text-center"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
          }}
        >
          No Products Available
        </h2>
      ) : (
        filteredProducts.map((product) => {
          const { id, brand, name, price, available, imageUrl } = product;

          return (
            <div
              className="card mb-3"
              key={id}
              style={{
                width: "18rem",
                height: "24rem",
                boxShadow: "rgba(0,0,0,0.24) 0px 2px 3px",
                backgroundColor: available ? "#fff" : "#ccc",
                margin: "10px",
              }}
            >
              <Link
                to={`/product/${id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <img
                  src={imageUrl}
                  alt={name}
                  style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover",
                    padding: "5px",
                  }}
                  onError={(e) => {
                    console.log("Failed Image URL:", imageUrl);
                    e.target.src =
                      "https://via.placeholder.com/400x250?text=No+Image";
                  }}
                />

                <div className="card-body">
                  <h5>{name}</h5>
                  <i>{"~ " + brand}</i>

                  <h5>{"$" + price}</h5>

                  <button
                    className="btn btn-primary"
                    style={{ width: "100%" }}
                    disabled={!available}
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart(product);
                    }}
                  >
                    {available ? "Add to Cart" : "Out of Stock"}
                  </button>
                </div>
              </Link>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Home;
