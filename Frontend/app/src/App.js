import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./Components/Home/Home";
import Register from "./Components/Register/Register";
import Login from "./Components/Login/Login";
import Navbar from "./Components/Common/Navbar";
import AddProduct from "./Components/Seller/AddProduct";
import YourProduct from "./Components/Seller/YourProduct";
import Profile from "./Components/Profile/Profile";
import EditProduct from "./Components/Seller/EditProduct";
import SingleProduct from "./Components/Buyer/SingleProduct";
import Cart from "./Components/Buyer/Cart";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/profile" element={<Profile />} />
        <Route exact path="/add-product" element={<AddProduct />} />
        <Route exact path="/your-products" element={<YourProduct />} />
        <Route
          exact
          path="/edit-product/:productId"
          element={<EditProduct />}
        />
        <Route
          exact
          path="/single-product/:singleProdId"
          element={<SingleProduct />}
        />
        <Route exact path="/cart-products" element={<Cart />} />
      </Routes>
    </div>
  );
}

export default App;
