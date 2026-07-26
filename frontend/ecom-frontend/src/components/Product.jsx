import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AppContext from "../Context/Context";
import axios from "../axios";
import { getProductImageUrl } from "../config";

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
    if (!window.confirm("Delete this product? This cannot be undone.")) return;
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
      <div className="state-message">
        <h3>Loading product...</h3>
      </div>
    );
  }

  return (
    <div className="product-page">
      <div className="product-detail-image">
        <img
          src={getProductImageUrl(id)}
          alt={product.name}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/500x500?text=No+Image";
          }}
        />
      </div>

      <div className="product-detail-info">
        <span className="product-category-tag">{product.category}</span>
        <h1>{product.name}</h1>
        <h5 className="product-detail-brand">{product.brand}</h5>
        <p className="product-detail-desc">{product.desc}</p>

        <div className="product-detail-price-box">
          <span className="product-detail-price">${product.price}</span>

          <button
            className={`cart-btn ${!product.available ? "disabled-btn" : ""}`}
            onClick={handleAddToCart}
            disabled={!product.available}
          >
            {product.available ? "Add to Cart" : "Out of Stock"}
          </button>

          <p className="stock-line">
            Stock available:{" "}
            <strong className={product.quantity > 0 ? "in-stock" : "no-stock"}>
              {product.quantity}
            </strong>
          </p>

          <p className="release-date">
            Listed on {new Date(product.releaseDate).toLocaleDateString()}
          </p>

          <div className="update-button">
            <button className="btn btn-outline-primary" type="button" onClick={handleEditClick}>
              <i className="bi bi-pencil-square"></i> Update
            </button>

            <button className="btn btn-outline-danger" type="button" onClick={deleteProduct}>
              <i className="bi bi-trash3"></i> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
