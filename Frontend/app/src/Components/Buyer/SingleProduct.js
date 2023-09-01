import { React, useContext, useEffect, useState } from "react";
import api from "../ApiConfig/index";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import "./SingleProduct.css";
import { AuthContexts } from "../../Context/AuthContext";

const SingleProduct = () => {
  const { state } = useContext(AuthContexts);
  const [singleProd, setSingleProd] = useState({});
  const { singleProdId } = useParams();
  const navigateTo = useNavigate();
  console.log(singleProd);

  useEffect(() => {
    if (state?.currentUser?.role == "Seller") {
      navigateTo("/");
    }
  }, [navigateTo, state]);

  useEffect(() => {
    const getSingleProduct = async () => {
      const token = JSON.parse(localStorage.getItem("Token"));

      if (token) {
        try {
          const response = await api.post("/get-singleproduct-data", {
            token,
            productId: singleProdId,
          });
          if (response.data.success) {
            setSingleProd(response.data.product);
          } else {
            setSingleProd({});
            toast.error(response.data.message);
          }
        } catch (error) {
          toast.error(error.response.data.message);
        }
      }
    };

    getSingleProduct();
  }, [singleProdId]);

  const handleAddToCart = async (singleProdId) => {
    const token = JSON.parse(localStorage.getItem("Token"));

    if (token) {
      try {
        const response = await api.post("/add-to-cart", {
          productId: singleProdId,
          token,
        });

        if (response.data.success) {
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
    <>
      <div id="single-product">
        {singleProd && (
          <div id="product">
            <div id="img">
              <img src={singleProd.image} alt="product" />
            </div>
            <div id="details">
              <h2>{singleProd.name}</h2>
              <h3>${singleProd.price}</h3>
              <h4>
                Category: <span>{singleProd.category}</span>
              </h4>
              <button onClick={() => handleAddToCart(singleProd._id)}>
                Add to cart
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SingleProduct;
