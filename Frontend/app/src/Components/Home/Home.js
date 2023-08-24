import React, { useContext } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { AuthContexts } from "../../Context/AuthContext";

const Home = () => {
  const { state, Logout } = useContext(AuthContexts);
  const navigateTo = useNavigate();

  console.log(state);

  return (
    <div id="home-screen">
      <div id="home">
        <h2>Home</h2>
        <p>{state?.currentUser?.name}</p>
        <button onClick={() => navigateTo("/login")}>Login</button>
        <button onClick={Logout}>Logout</button>
      </div>
    </div>
  );
};

export default Home;
