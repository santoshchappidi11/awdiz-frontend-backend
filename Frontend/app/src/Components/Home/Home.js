import React, { useContext, useEffect, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { AuthContexts } from "../../Context/AuthContext";
import axios from "axios";

const Home = () => {
  // const { state, Logout } = useContext(AuthContexts);
  // const navigateTo = useNavigate();
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    const getYourProducts = async () => {
      // const token = JSON.parse(localStorage.getItem("Token"));

      const response = await axios.get("http://localhost:8002/all-products");

      if (response.data.success) {
        setAllProducts(response.data.products);
      }
    };

    getYourProducts();
  }, []);

  return (
    <div id="home-screen">
      <div id="home">
        <h2>Home</h2>
        <p>All Products</p>
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
              </div>
            ))
          ) : (
            <h2>No Products Found!</h2>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
