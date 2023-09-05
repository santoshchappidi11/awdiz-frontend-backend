import axios from "axios";

// const token = JSON.parse(localStorage.getItem("Token"));
// console.log(token);

const api = axios.create({
  baseURL: "https://awdiz-backend.onrender.com/",
  // headers: { Authorization: `Bearer ${token}` },
});

export default api;
