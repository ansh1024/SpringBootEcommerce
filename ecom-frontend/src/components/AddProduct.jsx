import React, { useState } from "react";
import axios from "axios";

const AddProduct = () => {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();

      formData.append(
          "product",
          new Blob([JSON.stringify(product)], {
            type: "application/json",
          })
      );

      formData.append("imageFile", image);

      const response = await axios.post(
          "http://localhost:8080/api/products",
          formData
      );

      console.log(response.data);
      alert("Product added successfully!");
    } catch (error) {
      console.error(error);

      if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Response:", error.response.data);
      }

      alert("Error adding product");
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
                  placeholder="Product Name"
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
                  placeholder="Enter Brand"
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
                  placeholder="Product Description"
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
                  placeholder="Price"
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
                  placeholder="Stock Quantity"
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

                <label className="form-check-label">
                  Product Available
                </label>
              </div>
            </div>

            <div className="col-12">
              <button className="btn btn-primary" type="submit">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default AddProduct;
