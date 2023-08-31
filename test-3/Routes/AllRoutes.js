import express from "express";
import {
  Login,
  Register,
  getCurrentUser,
  getUserNumber,
  sendOtp,
  verifyOtp,
} from "../Controllers/User.controller.js";
import {
  addComments,
  addRating,
  allProducts,
} from "../Controllers/Product.controller.js";
import { isCheckValidUser } from "../Middlewares/All.middleware.js";

const router = express.Router();

router.post("/register", Register);
router.post("/login", Login);
router.post("/get-current-user", getCurrentUser);
router.post("/get-user-number", getUserNumber);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.get("/all-products", allProducts);
router.patch("/add-rating", isCheckValidUser, addRating);
router.patch("/add-comment", isCheckValidUser, addComments);

export default router;
