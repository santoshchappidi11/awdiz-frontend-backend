import React, { useContext, useEffect, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import api from "../ApiConfig/index";
import { toast } from "react-hot-toast";

const Home = () => {
  const navigateTo = useNavigate();
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    const getYourProducts = async () => {
      try {
        const response = await api.get("/all-products");
        console.log(response.data);
        if (response.data.success) {
          setAllProducts(response.data.products);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error.response.data.message);
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
            allProducts?.map((product) => (
              <div
                className="product"
                key={product._id}
                onClick={() => navigateTo(`/single-product/${product._id}`)}
              >
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
