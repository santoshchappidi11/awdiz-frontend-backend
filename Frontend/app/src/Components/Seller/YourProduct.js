// import axios from "axios";
import React, { useEffect, useState } from "react";
import SellerProtected from "../Common/SellerProtected";
import "./YourProduct.css";
import api from "../ApiConfig/index";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const YourProduct = () => {
  const [allProducts, setAllProducts] = useState([]);
  const navigateTo = useNavigate();

  useEffect(() => {
    const getYourProducts = async () => {
      const token = JSON.parse(localStorage.getItem("Token"));

      if (token) {
        try {
          const response = await api.post("/get-your-products", { token });
          if (response.data.success) {
            setAllProducts(response.data.products);
          } else {
            toast.error(response.data.message);
          }
        } catch (error) {
          toast.error(error.response.data.message);
        }
      }
    };

    getYourProducts();
  }, []);

  const deleteProduct = async (productId) => {
    const token = JSON.parse(localStorage.getItem("Token"));
    console.log(token);
    console.log(productId);

    if (token) {
      try {
        const response = await api.post("/delete-your-product", {
          token,
          productId,
        });

        if (response.data.success) {
           setAllProducts(response.data.products);
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };

  return (
    <SellerProtected>
      <div id="your-product-screen">
        <div id="header">
          <h2>Your Products</h2>
        </div>
        <div id="products">
          {allProducts?.length ? (
            allProducts.map((product) => (
              <div className="product" key={product._id}>
                <div className="image">
                  <img src={product.image} alt="product" />
                </div>
                <div className="details">
                  <h2>{product.name}</h2>
                  <h3>₹{product.price}</h3>
                  <p>{product.category}</p>
                </div>
                <div className="product-btn">
                  <button
                    onClick={() => navigateTo(`/edit-product/${product._id}`)}
                  >
                    Edit
                  </button>
                  <button onClick={() => deleteProduct(product._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <h2>No Products Found!</h2>
          )}
        </div>
      </div>
    </SellerProtected>
  );
};

export default YourProduct;
