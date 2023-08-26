import axios from "axios";
import React, { useEffect, useState } from "react";
import SellerProtected from "../Common/SellerProtected";
import "./YourProduct.css";

const YourProduct = () => {
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    const getYourProducts = async () => {
      const token = JSON.parse(localStorage.getItem("Token"));

      const response = await axios.post(
        "http://localhost:8002/get-your-products",
        { token }
      );

      if (response.data.success) {
        setAllProducts(response.data.products);
      }
    };

    getYourProducts();
  }, []);

  return (
    <SellerProtected>
      <div id="your-product-screen">
        <div id="header">
          <h2>Your Products</h2>
        </div>
        <div id="products">
          {allProducts?.length ? (
            allProducts.map((product) => (
              <div className="product">
                <div className="image">
                  <img src={product.image} alt="product" />
                </div>
                <div className="details">
                  <h2>{product.name}</h2>
                  <h3>₹{product.price}</h3>
                  <p>{product.category}</p>
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
