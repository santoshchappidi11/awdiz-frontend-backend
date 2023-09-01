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

    if (user) {
      for (let i = 0; i < user.cart.length; i++) {
        if (user.cart[i] == productId) {
          return res.status(404).json({
            success: false,
            message: "This Product already has been added to cart!",
          });
        }
      }
    }

    user?.cart.push(productId);

    await user.save();

    return res
      .status(200)
      .json({ success: true, user: user, message: "Product added to cart!" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};

export const getCartProducts = async (req, res) => {
  try {
    const { token } = req.body;
    console.log(token);

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
    return res.status(500).json({ success: false, message: error });
  }
};

export const removeCartProduct = async (req, res) => {
  try {
    const { token, productId } = req.body;
    console.log(token, productId, "-remove product 65");

    if (!token || !productId) throw new Error("Token, Product Id is required");

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedData) {
      return res.status(404).json({ status: error, message: "Invalid token!" });
    }

    const userId = decodedData?.userId;

    const user = await UserModel.findById({ _id: userId });

    if (!user)
      return res
        .status(404)
        .json({ status: false, message: "User not found!" });

    const cartProducts = user.cart;

    let newCartProducts = cartProducts.filter((item) => item != productId);
    user.cart = newCartProducts;

    // const removeItem = cartProducts.indexOf(productId);
    // cartProducts.splice(removeItem, 1);

    await user.save();

    if (user) {
      let finalCartProducts = [];
      for (let i = 0; i < user.cart.length; i++) {
        const product = await ProductModel.findById(user.cart[i]);
        if (product) {
          finalCartProducts.push(product);
        }
      }

      return res.status(200).json({
        success: true,
        user: user,
        message: "Product removed!",
        products: finalCartProducts,
      });
    }

    // throw new Error("Not a valid user to remove product!");
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
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
    return res.status(500).json({ success: false, message: error });
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
    return res.status(500).json({ success: false, message: error });
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId)
      return res
        .status(404)
        .json({ success: true, message: "Product Id is required!" });

    const product = await ProductModel.findById(productId);

    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Failed to fetch product" });

    return res.status(200).json({ success: true, product: product });
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};

export const removeAllCartProducts = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token)
      return res
        .satus(404)
        .json({ success: false, message: "Token is required!" });

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedData)
      return res
        .status(404)
        .json({ success: false, message: "Not a valid token" });

    const userId = decodedData?.userId;

    const user = await UserModel.findById(userId);

    if (user) {
      user.cart = [];
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Thank you for shopping! Your products will deliver soon...",
      });
    }
    return res.status(404).json({ success: false, message: "No user found!" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};
