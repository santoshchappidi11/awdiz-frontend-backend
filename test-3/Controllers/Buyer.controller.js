import jwt from "jsonwebtoken";
import UserModel from "../Models/User.model.js";
import ProductModel from "../Models/Product.model.js";

export const addToCart = async (req, res) => {
  try {
    const { token, productId } = req.body;

    if (!token || !productId)
      throw new Error("Token and Product Id is required!");

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decodedData?.userId;

    const user = await UserModel.findById({ _id: userId });

    user?.cart.push(productId);

    await user.save();

    return res.status(200).json({ success: true, user: user });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error });
  }
};

export const getCartProducts = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) throw new Error("Token is required");

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decodedData?.userId;

    const user = await UserModel.findById(userId);

    if (user) {
      let finalCartProducts = [];
      for (var i = 0; i < user.cart.length; i++) {
        const product = await ProductModel.findById(user.cart[i]);
        if (product) {
          finalCartProducts.push(product);
        }
      }
      return res
        .status(200)
        .json({ success: true, products: finalCartProducts });
    }

    throw new Error("User not found!");
  } catch (error) {
    return res.status(500).json({ status: "error", message: error });
  }
};

export const removeCartProduct = async (req, res) => {
  try {
    const { token, productId } = req.body;

    if (!token || !productId) throw new Error("Token, Product Id is required");

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedData) {
      return res.status(404).json({ status: error, message: "Invalid token!" });
    }

    const userId = decodedData?.userId;

    const user = await UserModel.findById({ _id: userId });

    const cartProducts = user.cart;

    const removeItem = cartProducts.indexOf(productId);

    cartProducts.splice(removeItem, 1);

    await user.save();

    return res.status(200).json({ success: true, user: user });

    // throw new Error("Not a valid user to remove product!");
  } catch (error) {
    return res.status(500).json({ status: "error", message: error });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const { token, productId } = req.body;

    if (!token || !productId)
      throw new Error("Token and Product Id is required!");

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decodedData?.userId;

    const user = await UserModel.findById({ _id: userId });

    user?.wishlist.push(productId);

    await user.save();

    return res.status(200).json({ success: true, user: user });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error });
  }
};

export const getWishlistProducts = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) throw new Error("Token is required");

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decodedData?.userId;

    const user = await UserModel.findById(userId);

    if (user) {
      let finalWishlistProducts = [];
      for (var i = 0; i < user.wishlist.length; i++) {
        const product = await ProductModel.findById(user.wishlist[i]);
        if (product) {
          finalWishlistProducts.push(product);
        }
      }
      return res
        .status(200)
        .json({ success: true, products: finalWishlistProducts });
    }

    throw new Error("User not found!");
  } catch (error) {
    return res.status(500).json({ status: "error", message: error });
  }
};
