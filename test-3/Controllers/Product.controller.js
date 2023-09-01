import ProductModel from "../Models/Product.model.js";
import jwt from "jsonwebtoken";
import UserModel from "../Models/User.model.js";

export const addProduct = async (req, res) => {
  try {
    const { image, name, price, category } = req.body.addProductData;
    const { token } = req.body;

    if (!image || !name || !price || !category || !token)
      return res
        .status(404)
        .json({ success: false, message: "All fields are mandatory!" });

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedData)
      return res
        .status(404)
        .json({ success: false, message: "Token not valid!" });

    const userId = decodedData.userId;

    const product = new ProductModel({
      image,
      name,
      price,
      category,
      userId: userId,
    });
    await product.save();

    return res
      .status(201)
      .json({ success: true, message: "Product added successfully!" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const allProducts = async (req, res) => {
  try {
    // const headersWithToken = req.headers.authorization;
    // if (headersWithToken) {
    //   console.log(headersWithToken, "-HEADERS here");
    //   const token = headersWithToken.split(" ")[1];
    //   if (token) {
    //     console.log(token, "-TOKEN here");
    //   }
    // }

    const products = await ProductModel.find({});

    if (products?.length) {
      return res.status(200).json({ success: true, products: products });
    }
    return res.status(404).json({ success: false, message: "No Products!" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error });
  }
};

export const getYourProducts = async (req, res) => {
  try {
    const { token } = req.body;

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedData)
      return res
        .status(404)
        .json({ success: false, message: "Not a valid token!" });

    const userId = decodedData.userId;

    const products = await ProductModel.find({ userId: userId });

    if (products.length)
      return res.status(200).json({ success: true, products: products });

    return res
      .status(404)
      .json({ success: false, message: "No Products Found!" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getEditProductData = async (req, res) => {
  try {
    const { productId, token } = req.body;

    if (!token)
      return res
        .status(404)
        .json({ success: false, message: "Token is required!" });

    if (!productId)
      return res
        .status(404)
        .json({ success: false, message: "ProductId is required!" });

    const editProduct = await ProductModel.findById(productId);

    if (!editProduct)
      return res
        .status(404)
        .json({ success: false, message: "No Product Found!" });

    return res.status(200).json({ success: true, product: editProduct });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const updateYourProduct = async (req, res) => {
  try {
    const { image, name, price, category } = req.body.editProductData;
    const { productId, token } = req.body;

    if (!productId)
      return res
        .status(404)
        .json({ success: false, message: "Product Id is required" });

    if (!token)
      return res
        .status(404)
        .json({ success: false, message: "Token is required" });

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedData)
      return res
        .status(404)
        .json({ success: false, message: "Not a valid token!" });

    const userId = decodedData.userId;

    const updatedProduct = await ProductModel.findOneAndUpdate(
      { _id: productId, userId: userId },
      { image, name, price, category },
      { new: true }
    );

    if (updatedProduct)
      return res.status(200).json({
        success: true,
        product: updatedProduct,
        message: "Product updated successfully!",
      });

    return res.status(404).json({
      success: false,
      message: "you are trying to update product which is not yours",
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteYourProduct = async (req, res) => {
  try {
    const { token, productId } = req.body;
    // console.log(token, productId);

    if (!token || !productId)
      return res
        .status(404)
        .json({ success: false, message: "Token and Product Id is required!" });

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decodedData?.userId;

    const isProductDeleted = await ProductModel.findOneAndDelete({
      _id: productId,
      userId: userId,
    });

    const newProducts = await ProductModel.find({ userId: userId });
    // console.log(newProducts);
    if (isProductDeleted) {
      return res.status(200).json({
        success: true,
        products: newProducts,
        message: "Product Deleted!",
      });
    }

    return res.status(404).json({
      success: false,
      message: "Something went wrong product not deleted!",
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const addRating = async (req, res) => {
  try {
    const { rating, productId } = req.body;

    if (rating > 5) {
      return res
        .status(404)
        .json({ success: false, message: "Not a valid rating!" });
    }

    const addedRatingToProduct = await ProductModel.findByIdAndUpdate(
      productId,
      { $push: { ratings: rating } },
      { new: true }
    );

    if (addedRatingToProduct) {
      return res.status(200).json({
        success: true,
        message: "Rating added successfully!",
        product: addedRatingToProduct,
      });
    }

    throw new Error("MongoDb error!");
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};

export const addComments = async (req, res) => {
  try {
    const { comment, productId, userId } = req.body;

    const user = await UserModel.findById(userId);

    const addedcommentToProduct = await ProductModel.findByIdAndUpdate(
      productId,
      {
        $push: {
          comments: { comments: comment, name: user.name, userId: userId },
        },
      },
      { new: true }
    );

    if (addedcommentToProduct) {
      return res.status(200).json({
        success: true,
        message: "comment added successfully!",
        product: addedcommentToProduct,
      });
    }

    throw new Error("MongoDb error!");
  } catch (error) {
    return res.status(500).json({ success: false, message: "server error" });
  }
};
