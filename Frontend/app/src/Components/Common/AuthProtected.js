import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContexts } from "../../Context/AuthContext";

const AuthProtected = ({ children }) => {
  const { state } = useContext(AuthContexts);
  const navigateTo = useNavigate();

  useEffect(() => {
    if (!state?.currentUser?.name) {
      navigateTo("/");
    }
  }, [state, navigateTo]);

  return <>{state?.currentUser?.name ? children : null}</>;
};

export default AuthProtected;
