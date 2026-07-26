import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../axios";
import AppContext from "../Context/Context";

const emptyProduct = {
  name: "",
  brand: "",
  desc: "",
  price: "",
  category: "",
  quantity: "",
  releaseDate: "",
  available: false,
};

const AddProduct = () => {
  const { refreshData } = useContext(AppContext);
  const navigate = useNavigate();

  const [product, setProduct] = useState(emptyProduct);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(file ? URL.createObjectURL(file) : "");
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    if (!image) {
      alert("Please select an image for the product.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append(
        "product",
        new Blob([JSON.stringify(product)], { type: "application/json" })
      );
      formData.append("imageFile", image);

      await API.post("/products", formData);

      alert("Product added successfully!");
      refreshData();
      setProduct(emptyProduct);
      setImage(null);
      setImagePreview("");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Error adding product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-page">
      <div className="form-card">
        <h2 className="form-title">Add a New Product</h2>
        <p className="form-subtitle">Fill in the details below to list a product.</p>

        <form className="row g-3" onSubmit={submitHandler}>
          <div className="col-md-6">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Product Name"
              name="name"
              value={product.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Brand</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Brand"
              name="brand"
              value={product.brand}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="col-12">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              placeholder="Product Description"
              name="desc"
              rows="3"
              value={product.desc}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Price ($)</label>
            <input
              type="number"
              className="form-control"
              placeholder="0.00"
              name="price"
              min="0"
              step="0.01"
              value={product.price}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              name="category"
              value={product.category}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Category</option>
              <option value="Laptop">Laptop</option>
              <option value="Headphone">Headphone</option>
              <option value="Mobile">Mobile</option>
              <option value="Electronics">Electronics</option>
              <option value="Toys">Toys</option>
              <option value="Fashion">Fashion</option>
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">Stock Quantity</label>
            <input
              type="number"
              className="form-control"
              placeholder="0"
              name="quantity"
              min="0"
              value={product.quantity}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Release Date</label>
            <input
              type="date"
              className="form-control"
              name="releaseDate"
              value={product.releaseDate}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Image</label>
            <input className="form-control" type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          {imagePreview && (
            <div className="col-12">
              <img src={imagePreview} alt="Preview" className="image-preview" />
            </div>
          )}

          <div className="col-12">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="availableCheck"
                checked={product.available}
                onChange={(e) => setProduct({ ...product, available: e.target.checked })}
              />
              <label className="form-check-label" htmlFor="availableCheck">
                Product Available
              </label>
            </div>
          </div>

          <div className="col-12">
            <button className="btn btn-primary form-submit-btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
