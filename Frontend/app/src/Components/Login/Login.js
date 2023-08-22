import React, { useContext, useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { AuthContexts } from "../../Context/AuthContext";

const Login = () => {
  const { Login } = useContext(AuthContexts);
  const navigateTo = useNavigate();
  const [userData, setUserData] = useState({ email: "", password: "" });

  const handleChangeValues = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (userData.email && userData.password) {
      const response = await axios.post("http://localhost:8002/login", {
        userData,
      });

      if (response.data.success) {
        Login(response.data);
        setUserData({ email: "", password: "" });
        toast.success(response.data.message);
        navigateTo("/");
        console.log(response.data);
      } else {
        toast.error(response.data.message);
      }
    } else {
      toast.error("Please fill all the fields!");
    }
  };

  return (
    <div id="login-screen">
      <form onSubmit={handleLoginSubmit}>
        <div id="login-header">
          <h2>Login</h2>
        </div>
        <div className="fields">
          <label>Email:</label>
          <input
            type="text"
            name="email"
            value={userData.email}
            onChange={handleChangeValues}
          />
        </div>
        <div className="fields">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={userData.password}
            onChange={handleChangeValues}
          />
        </div>
        <button type="submit">Login</button>
        <div>
          <p style={{ cursor: "pointer" }}>
            Don't have an Account?{" "}
            <b onClick={() => navigateTo("/register")}>Register</b>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
