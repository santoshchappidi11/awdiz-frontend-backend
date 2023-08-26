import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import SellerProtected from "../Common/SellerProtected";
import "./AddProduct.css"

const AddProduct = () => {
  const navigateTo = useNavigate();

  const [addProductData, setAddProductData] = useState({
    image: "",
    name: "",
    price: "",
    category: "",
  });

  const handleChangeValues = (e) => {
    setAddProductData({ ...addProductData, [e.target.name]: e.target.value });
  };

  const handleAddProductSubmit = async (e) => {
    e.preventDefault();

    if (
      addProductData.image &&
      addProductData.name &&
      addProductData.price &&
      addProductData.category
    ) {
      const token = JSON.parse(localStorage.getItem("Token"));
      try {
        const response = await axios.post("http://localhost:8002/add-product", {
          addProductData,
          token,
        });

        if (response.data.success) {
          setAddProductData({ image: "", name: "", price: "", category: "" });
          navigateTo("/your-products");
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    } else {
      toast.error("Please fill all the details!");
    }
  };

  return (
    <SellerProtected>
      <div id="add-product-screen">
        <form onSubmit={handleAddProductSubmit}>
          <div id="add-product-header">
            <h2>Add Product</h2>
          </div>
          <div className="fields">
            <label>Image :</label>
            <input
              type="text"
              name="image"
              value={addProductData.image}
              onChange={handleChangeValues}
            />
          </div>
          <div className="fields">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={addProductData.name}
              onChange={handleChangeValues}
            />
          </div>
          <div className="fields">
            <label>Price:</label>
            <input
              type="number"
              name="price"
              value={addProductData.price}
              onChange={handleChangeValues}
            />
          </div>
          <div className="fields">
            <label>Category:</label>
            <input
              type="text"
              name="category"
              value={addProductData.category}
              onChange={handleChangeValues}
            />
          </div>
          <button type="submit">Add Product</button>
        </form>
      </div>
    </SellerProtected>
  );
};

export default AddProduct;
