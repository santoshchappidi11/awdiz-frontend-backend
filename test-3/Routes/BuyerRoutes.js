import express from "express";
import {
  addToCart,
  addToWishlist,
  getCartProducts,
  getWishlistProducts,
  removeCartProduct,
} from "../Controllers/Buyer.controller.js";

const router = express.Router();

router.post("/add-to-cart", addToCart);
router.get("/get-cart-products", getCartProducts);
router.delete("/remove-cart-product", removeCartProduct);
router.post("/add-to-wishlist", addToWishlist);
router.get("/get-wishlist-products", getWishlistProducts);

export default router;
