import express from "express";
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
} from "../Controllers/Admin.controller.js";
import { checkIsAdmin } from "../Middlewares/All.middleware.js";

const router = express.Router();

router.get("/get-all-buyers", checkIsAdmin, getAllBuyers);
router.get("/get-all-sellers", checkIsAdmin, getAllSellers);
router.get("/get-all-products", checkIsAdmin, getAllProducts);
router.patch("/block-user", checkIsAdmin, blockUser);
router.patch("/unblock-user", checkIsAdmin, unBlockUser);
router.patch("/block-product", checkIsAdmin, blockProduct);
router.patch("/unblock-product", checkIsAdmin, unblockProduct);
router.patch("/verify-product", checkIsAdmin, verifyProduct);
router.get("/get-verified-products", checkIsAdmin, getVerifiedProducts);
router.get("/get-unverified-products", checkIsAdmin, getUnverifiedProducts);
router.get("/get-blocked-products", checkIsAdmin, getBlockedProducts);

export default router;
