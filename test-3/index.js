import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import {
  Login,
  Register,
  getCurrentUser,
} from "./Controllers/User.controller.js";
import {
  addComments,
  addProduct,
  addRating,
  allProducts,
  deleteYourProduct,
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

const app = express();
app.use(express.json());
dotenv.config();
app.use(cors());

app.get("/", (req, res) => {
  res.send("working!!!");
});

app.post("/register", Register);

app.post("/login", Login);

app.post("/get-current-user", getCurrentUser);

app.post("/add-product", checkSeller, addProduct);

app.get("/all-products", allProducts);

app.get("/get-your-products", checkSeller, getYourProducts);

app.patch("/update-your-product", checkSeller, updateYourProduct);
app.delete("/delete-your-product", checkSeller, deleteYourProduct);

app.post("/add-to-cart", addToCart);
app.get("/get-cart-products", getCartProducts);
app.delete("/remove-cart-product", removeCartProduct);

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
