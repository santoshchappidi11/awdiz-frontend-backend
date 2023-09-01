import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";

import {
  Login,
  Register,
  getCurrentUser,
  getUserNumber,
  sendOtp,
  verifyOtp,
} from "./Controllers/User.controller.js";
import {
  addComments,
  addProduct,
  addRating,
  allProducts,
  deleteYourProduct,
  getEditProductData,
  getYourProducts,
  updateYourProduct,
} from "./Controllers/Product.controller.js";
import {
  checkIsAdmin,
  checkSeller,
  isCheckValidUser,
} from "./Middlewares/All.middleware.js";
import {
  getWishlistProducts,
  addToCart,
  addToWishlist,
  getCartProducts,
  removeCartProduct,
  getSingleProduct,
  removeAllCartProducts,
} from "./Controllers/Buyer.controller.js";
import {
  blockProduct,
  blockUser,
  getAllBuyers,
  getAllProducts,
  getAllSellers,
  getBlockedProducts,
  getUnverifiedProducts,
  getVerifiedProducts,
  unBlockUser,
  unblockProduct,
  verifyProduct,
} from "./Controllers/Admin.controller.js";
// import { CheckJwt } from "./Middlewares/CheckJwt.js";

const app = express();
app.use(express.json());
dotenv.config();
app.use(cors());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("working!!!");
});
app.post("/register", Register);
app.post("/login", Login);
app.post("/get-current-user", getCurrentUser);
app.post("/get-user-number", getUserNumber);
app.post("/send-otp", sendOtp);
app.post("/verify-otp", verifyOtp);
app.get("/all-products", allProducts);

app.post("/add-product", checkSeller, addProduct);
app.post("/get-your-products", checkSeller, getYourProducts);
app.post("/get-editproduct-data", checkSeller, getEditProductData);
app.patch("/update-your-product", checkSeller, updateYourProduct);
app.post("/delete-your-product", checkSeller, deleteYourProduct);

app.post("/get-singleproduct-data", getSingleProduct);
app.post("/add-to-cart", addToCart);
app.post("/get-cart-products", getCartProducts);
app.post("/remove-cart-product", removeCartProduct);
app.post("/remove-all-cart-products", removeAllCartProducts);
app.post("/add-to-wishlist", addToWishlist);
app.get("/get-wishlist-products", getWishlistProducts);

// buyer

// admin
app.get("/get-all-buyers", checkIsAdmin, getAllBuyers);
app.get("/get-all-sellers", checkIsAdmin, getAllSellers);
app.get("/get-all-products", checkIsAdmin, getAllProducts);
app.patch("/block-user", checkIsAdmin, blockUser);
app.patch("/unblock-user", checkIsAdmin, unBlockUser);
app.patch("/block-product", checkIsAdmin, blockProduct);
app.patch("/unblock-product", checkIsAdmin, unblockProduct);
app.patch("/verify-product", checkIsAdmin, verifyProduct);
app.get("/get-verified-products", checkIsAdmin, getVerifiedProducts);
app.get("/get-unverified-products", checkIsAdmin, getUnverifiedProducts);
app.get("/get-blocked-products", checkIsAdmin, getBlockedProducts);
app.patch("/add-rating", isCheckValidUser, addRating);
app.patch("/add-comment", isCheckValidUser, addComments);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("connected to DB...");
  })
  .catch((error) => {
    console.log("Something went wrong", error);
  });

app.listen(8002, () => {
  console.log("Listening on port 8002");
});
