import React, { useContext } from "react";
import { AuthContexts } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const { state, Login, Logout } = useContext(AuthContexts);
  const navigateTo = useNavigate();

  return (
    <div id="navbar">
      <div id="logo">
        <h2 onClick={() => navigateTo("/")}>LOGO</h2>
      </div>
      <div id="nav-items">
        {state?.currentUser?.role != "Seller" && (
          <>
            <h4>Mens</h4>
            <h4>Womens</h4>
            <h4>Kids</h4>
          </>
        )}

        {state?.currentUser?.role == "Seller" && (
          <>
            <h4 onClick={() => navigateTo("/add-product")}>Add Product</h4>
            <h4 onClick={() => navigateTo("/your-products")}>Your Products</h4>
          </>
        )}
      </div>
      <div id="nav-right">
        {state?.currentUser?.name ? (
          <>
            <p>
              Hi {state?.currentUser?.name?.toUpperCase()}(
              {state?.currentUser?.role})
            </p>
            <h4 onClick={() => navigateTo("/profile")}>Profile</h4>
            {state?.currentUser?.role == "Buyer" && <h4>Cart</h4>}
            <h4 onClick={Logout}>Logout</h4>
          </>
        ) : (
          <h4 onClick={() => navigateTo("/login")}>Register/Login</h4>
        )}
      </div>
    </div>
  );
};

export default Navbar;
