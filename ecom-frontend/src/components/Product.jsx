import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AppContext from "../Context/Context";
import axios from "../axios";

const Product = () => {
  const { id } = useParams();
  const { addToCart, removeFromCart, refreshData } = useContext(AppContext);

  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product);
    alert("Product added to cart");
  };

  const handleEditClick = () => {
    navigate(`/product/update/${id}`);
  };

  const deleteProduct = async () => {
    try {
      await axios.delete(`/products/${id}`);
      removeFromCart(id);
      refreshData();
      alert("Product deleted successfully");
      navigate("/");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  if (!product) {
    return (
      <h2 className="text-center" style={{ padding: "10rem" }}>
        Loading...
      </h2>
    );
  }

  return (
    <div className="containers">
      <img
        className="left-column-img"
        src={`http://localhost:8080/api/products/${id}/image`}
        alt={product.name}
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/400x400?text=No+Image";
        }}
      />

      <div className="right-column">
        <div className="product-description">
          <span>{product.category}</span>
          <h1>{product.name}</h1>
          <h5>{product.brand}</h5>
          <p>{product.desc}</p>
        </div>

        <div className="product-price">
          <span>${product.price}</span>

          <button
            className={`cart-btn ${!product.available ? "disabled-btn" : ""}`}
            onClick={handleAddToCart}
            disabled={!product.available}
          >
            {product.available ? "Add to Cart" : "Out of Stock"}
          </button>

          <h6>
            Stock Available :{" "}
            <i style={{ color: "green", fontWeight: "bold" }}>
              {product.quantity}
            </i>
          </h6>

          <p className="release-date">
            <strong>Product listed on:</strong>{" "}
            {new Date(product.releaseDate).toLocaleDateString()}
          </p>

          <div className="update-button">
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleEditClick}
            >
              Update
            </button>

            <button
              className="btn btn-danger"
              type="button"
              onClick={deleteProduct}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
