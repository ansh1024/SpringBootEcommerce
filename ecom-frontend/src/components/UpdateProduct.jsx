import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/products/${id}`,
      );

      setProduct({
        ...response.data,
        releaseDate: response.data.releaseDate
          ? response.data.releaseDate.split("T")[0]
          : "",
      });

      setImagePreview(`http://localhost:8080/api/products/${id}/image`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setProduct({
      ...product,
      [name]: value,
    });
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

    try {
      const formData = new FormData();

      formData.append(
        "product",
        new Blob([JSON.stringify(product)], {
          type: "application/json",
        }),
      );

      if (image) {
        formData.append("imageFile", image);
      }

      const response = await axios.put(
        `http://localhost:8080/api/products/${id}`,
        formData,
      );

      console.log(response.data);

      alert("Product Updated Successfully!");

      navigate(`/product/${id}`);
    } catch (error) {
      console.error(error);

      if (error.response) {
        console.log(error.response.data);
      }

      alert("Error Updating Product");
    }
  };

  return (
    <div className="container">
      <div className="center-container">
        <form className="row g-3 pt-5" onSubmit={submitHandler}>
          <div className="col-md-6">
            <label className="form-label">
              <h6>Name</h6>
            </label>

            <input
              type="text"
              className="form-control"
              name="name"
              value={product.name}
              onChange={handleInputChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">
              <h6>Brand</h6>
            </label>

            <input
              type="text"
              className="form-control"
              name="brand"
              value={product.brand}
              onChange={handleInputChange}
            />
          </div>

          <div className="col-12">
            <label className="form-label">
              <h6>Description</h6>
            </label>

            <input
              type="text"
              className="form-control"
              name="desc"
              value={product.desc}
              onChange={handleInputChange}
            />
          </div>

          <div className="col-md-5">
            <label className="form-label">
              <h6>Price</h6>
            </label>

            <input
              type="number"
              className="form-control"
              name="price"
              value={product.price}
              onChange={handleInputChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">
              <h6>Category</h6>
            </label>

            <select
              className="form-select"
              name="category"
              value={product.category}
              onChange={handleInputChange}
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
            <label className="form-label">
              <h6>Stock Quantity</h6>
            </label>

            <input
              type="number"
              className="form-control"
              name="quantity"
              value={product.quantity}
              onChange={handleInputChange}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">
              <h6>Release Date</h6>
            </label>

            <input
              type="date"
              className="form-control"
              name="releaseDate"
              value={product.releaseDate}
              onChange={handleInputChange}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">
              <h6>Image</h6>
            </label>

            <input
              className="form-control"
              type="file"
              onChange={handleImageChange}
            />

            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                width="150"
                className="mt-2"
              />
            )}
          </div>

          <div className="col-12">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                checked={product.available}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    available: e.target.checked,
                  })
                }
              />

              <label className="form-check-label">Product Available</label>
            </div>
          </div>

          <div className="col-12">
            <button className="btn btn-primary" type="submit">
              Update Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;
