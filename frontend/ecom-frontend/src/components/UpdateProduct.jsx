import React, { useContext, useEffect, useState } from "react";
import API from "../axios";
import { useNavigate, useParams } from "react-router-dom";
import AppContext from "../Context/Context";
import { getProductImageUrl } from "../config";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { refreshData } = useContext(AppContext);

  const [product, setProduct] = useState({
    name: "",
    brand: "",
    desc: "",
    price: "",
    category: "",
    quantity: "",
    releaseDate: "",
    available: false,
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await API.get(`/products/${id}`);

      setProduct({
        ...response.data,
        releaseDate: response.data.releaseDate
          ? response.data.releaseDate.split("T")[0]
          : "",
      });

      setImagePreview(getProductImageUrl(id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      formData.append(
        "product",
        new Blob([JSON.stringify(product)], { type: "application/json" }),
      );

      if (image) {
        formData.append("imageFile", image);
      }

      await API.put(`/products/${id}`, formData);

      alert("Product Updated Successfully!");
      refreshData();
      navigate(`/product/${id}`);
    } catch (error) {
      console.error(error);
      alert("Error Updating Product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-page">
      <div className="form-card">
        <h2 className="form-title">Update Product</h2>
        <p className="form-subtitle">Editing product #{id}</p>

        <form className="row g-3" onSubmit={submitHandler}>
          <div className="col-md-6">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
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
                id="availableCheckUpdate"
                checked={product.available}
                onChange={(e) => setProduct({ ...product, available: e.target.checked })}
              />
              <label className="form-check-label" htmlFor="availableCheckUpdate">
                Product Available
              </label>
            </div>
          </div>

          <div className="col-12">
            <button className="btn btn-primary form-submit-btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;
