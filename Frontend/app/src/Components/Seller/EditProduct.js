import React, { useEffect, useState } from "react";
import SellerProtected from "../Common/SellerProtected";
import { toast } from "react-hot-toast";
import api from "../ApiConfig/index";
import { useNavigate, useParams } from "react-router-dom";
import "./EditProduct.css";

const EditProduct = () => {
  const product = useParams();
  const navigateTo = useNavigate();
  const [editProductData, setEditProductData] = useState({
    image: "",
    name: "",
    price: "",
    category: "",
  });

  useEffect(() => {
    const getEditProduct = async () => {
      const token = JSON.parse(localStorage.getItem("Token"));

      if (token) {
        try {
          const response = await api.post("/get-editproduct-data", {
            token,
            productId: product.productId,
          });
          if (response.data.success) {
            // console.log(response.data);
            setEditProductData(response.data.product);
          } else {
            toast.error(response.data.message);
          }
        } catch (error) {
          toast.error(error.response.data.message);
        }
      }
    };

    getEditProduct();
  }, [product.productId]);

  const handleChangeValues = (e) => {
    setEditProductData({ ...editProductData, [e.target.name]: e.target.value });
  };

  const handleEditProductSubmit = async (e) => {
    e.preventDefault();

    if (
      editProductData.image ||
      editProductData.name ||
      editProductData.price ||
      editProductData.category
    ) {
      try {
        const token = JSON.parse(localStorage.getItem("Token"));
        const response = await api.patch("/update-your-product", {
          editProductData,
          token,
          productId: product.productId,
        });

        if (response.data.success) {
          setEditProductData({
            image: "",
            name: "",
            price: "",
            category: "",
          });
          toast.success(response.data.message);
          navigateTo("/your-products");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    } else {
      toast.error("Please fill atleast one field to edit product!");
    }
  };

  return (
    <SellerProtected>
      <div id="edit-product-screen">
        <form onSubmit={handleEditProductSubmit}>
          <div id="edit-product-header">
            <h2>Edit Product</h2>
          </div>
          <div className="fields">
            <label>Image :</label>
            <input
              type="text"
              name="image"
              value={editProductData.image}
              onChange={handleChangeValues}
            />
          </div>
          <div className="fields">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={editProductData.name}
              onChange={handleChangeValues}
            />
          </div>
          <div className="fields">
            <label>Price:</label>
            <input
              type="number"
              name="price"
              value={editProductData.price}
              onChange={handleChangeValues}
            />
          </div>
          <div className="fields">
            <label>Category:</label>
            <input
              type="text"
              name="category"
              value={editProductData.category}
              onChange={handleChangeValues}
            />
          </div>
          <button type="submit">Update Product</button>
        </form>
      </div>
    </SellerProtected>
  );
};

export default EditProduct;
