import React, { useContext, useEffect } from "react";
import { AuthContexts } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const SellerProtected = ({ children }) => {
  const { state } = useContext(AuthContexts);
  const navigateTo = useNavigate();

  useEffect(() => {
    if (state?.currentUser?.role != "Seller") {
      navigateTo("/");
    }
  }, [state, navigateTo]);

  return <>{state?.currentUser?.role == "Seller" ? children : null}</>;
};

export default SellerProtected;
