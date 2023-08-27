import React, { useContext, useEffect, useState } from "react";
import "./Register.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { AuthContexts } from "../../Context/AuthContext";

const Register = () => {
  const { state } = useContext(AuthContexts);
  const navigateTo = useNavigate();

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    number: "",
    password: "",
    confirmPassword: "",
    role: "Buyer",
  });

  useEffect(() => {
    if (state?.currentUser?.name) {
      navigateTo("/");
    }
  }, [state, navigateTo]);

  const handleChangeValues = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (
      userData.name &&
      userData.email &&
      userData.number &&
      userData.password &&
      userData.confirmPassword &&
      userData.role
    ) {
      if (userData.password == userData.confirmPassword) {
        const response = await axios.post("http://localhost:8002/register", {
          userData,
        });

        if (response.data.success) {
          setUserData({
            name: "",
            email: "",
            number: "",
            password: "",
            confirmPassword: "",
            role: "Buyer",
          });
          toast.success(response.data.message);
          navigateTo("/login");
          // console.log(response.data);
        } else {
          toast.error(response.data.message);
        }
      } else {
        toast.error("Password and Confirm password does not match!");
      }
    } else {
      toast.error("Please fill all the fields!");
    }
  };

  return (
    <div id="register-screen">
      <form onSubmit={handleRegisterSubmit}>
        <div id="register-header">
          <h2>Register</h2>
        </div>
        <div className="fields">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleChangeValues}
          />
        </div>
        <div className="fields">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChangeValues}
          />
        </div>
        <div className="fields">
          <label>Contact Number:</label>
          <input
            type="number"
            name="number"
            value={userData.number}
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
        <div className="fields">
          <label>Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={userData.confirmPassword}
            onChange={handleChangeValues}
          />
        </div>
        <div className="roles">
          <select
            name="role"
            value={userData.role}
            onChange={handleChangeValues}
          >
            <option>Buyer</option>
            <option>Seller</option>
          </select>
        </div>
        <button type="submit">Register</button>
        <div>
          <p style={{ cursor: "pointer" }}>
            Already have an Account?{" "}
            <b onClick={() => navigateTo("/login")}>Login</b>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
