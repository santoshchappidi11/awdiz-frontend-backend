import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import api from "../ApiConfig/index";
import "./Cart.css";
import { AuthContexts } from "../../Context/AuthContext";
// import { useNavigate } from "react-router-dom";

const Cart = () => {
  // const navigateTo = useNavigate();
  const { state } = useContext(AuthContexts);
  const [cartProducts, setCartProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (cartProducts?.length) {
      let cartTotalPrice = 0;
      for (let i = 0; i < cartProducts?.length; i++) {
        console.log(cartProducts[i]);
        cartTotalPrice += cartProducts[i]?.price;
      }
      setTotalPrice(cartTotalPrice);
    } else {
      setTotalPrice(0);
    }
  }, [cartProducts]);

  const removeProduct = async (productId) => {
    const token = JSON.parse(localStorage.getItem("Token"));

    if (token) {
      try {
        const response = await api.post("/remove-cart-product", {
          token,
          productId,
        });
        if (response.data.success) {
          toast.success(response.data.message);
          setCartProducts(response.data.products);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };

  const removeAllProducts = async () => {
    const token = JSON.parse(localStorage.getItem("Token"));

    if (token) {
      try {
        const response = await api.post("/remove-all-cart-products", {
          token,
        });
        if (response.data.success) {
          toast.success(response.data.message);
          setCartProducts([]);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };

  useEffect(() => {
    const getCartProducts = async () => {
      const token = JSON.parse(localStorage.getItem("Token"));
      // console.log(token);

      if (token) {
        try {
          const response = await api.post("/get-cart-products", {
            token: token,
          });

          if (response.data.success) {
            setCartProducts(response.data.products);
          } else {
            setCartProducts([]);
            toast.error(response.data.message);
          }
        } catch (error) {
          toast.error(error.response.data.message);
        }
      }
    };

    getCartProducts();
  }, []);

  return (
    <div id="cart-screen">
      <div id="cart-products">
        {state?.currentUser?.name ? (
          <>
            <div id="left">
              <div id="products">
                {cartProducts?.length ? (
                  cartProducts.map((prod, index) => (
                    <div className="product" key={index}>
                      <div className="img">
                        <img src={prod.image} alt="product" />
                      </div>
                      <div className="details">
                        <h3>{prod.name}</h3>
                        <h4>₹{prod.price}</h4>
                        <button onClick={() => removeProduct(prod._id)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <h2>No products in the cart!</h2>
                )}
              </div>
            </div>
            <div id="right">
              <h3>Price Summary</h3>
              <div id="price-summary">
                <div id="details">
                  <div>
                    <h4>Total Price:</h4>
                    <h4>₹{totalPrice}</h4>
                  </div>
                  <div>
                    <h4>Discount(50%)</h4>
                    <h4>₹{totalPrice / 2}</h4>
                  </div>
                  <div>
                    <h4>Delivery Charges:</h4>
                    <h4>₹0</h4>
                  </div>
                  <div>
                    <h2>TOTAL</h2>
                    <h2>₹{totalPrice / 2}</h2>
                  </div>
                </div>
                <div id="checkout">
                  <button onClick={removeAllProducts}>Checkout</button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <h2>Please login to view the cart page : )</h2>
        )}
      </div>
    </div>
  );
};

export default Cart;
