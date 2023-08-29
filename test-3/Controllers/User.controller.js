import UserModel from "../Models/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { sendTwilioMessage } from "../helpers/Sms.js";

export const Register = async (req, res) => {
  try {
    const { name, email, password, role, number } = req.body.userData;
    if (!name || !email || !password || !role || !number)
      return res.json({ success: false, message: "All fields are required!" });

    const isEmailExist = await UserModel.find({ email: email });
    if (isEmailExist.length) {
      return res.json({
        success: false,
        message: "This email already exists, try different email!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new UserModel({
      name,
      email,
      password: hashedPassword,
      role,
      number,
    });
    await user.save();
    return res.json({
      success: true,
      message: "Registration successfull!",
    });
  } catch (error) {
    return res.json({ success: false, message: error });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body.userData;
    if (!email || !password)
      return res.json({ success: false, message: "All fields are required!" });

    const user = await UserModel.findOne({ email });
    if (!user) return res.json({ success: false, message: "User not found!" });

    if (user.isBlocked) {
      return res.json({
        success: false,
        message: "You have been blocked!",
      });
    }

    const isPasswordRight = await bcrypt.compare(password, user.password);

    if (isPasswordRight) {
      const userObject = {
        name: user.name,
        email: user.email,
        _id: user._id,
        role: user.role,
      };

      const expiryTime = user?.role == "Seller" ? "4h" : "1h";

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: expiryTime,
      });

      return res.json({
        success: true,
        message: "Login successfull",
        user: userObject,
        token: token,
      });
    }
    return res.json({ success: false, message: "Password is wrong" });
  } catch (error) {
    return res.json({ success: false, message: error });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token)
      return res
        .status(404)
        .json({ success: false, message: "Token is required!" });

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedData)
      return res
        .status(404)
        .json({ success: false, message: "Not a valid json token!" });

    // return res.send(decodedData);

    const userId = decodedData?.userId;

    const user = await UserModel.findById(userId);

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });

    const userObj = {
      name: user?.name,
      email: user?.email,
      role: user?.role,
      _id: user?._id,
      number: user?.number,
    };

    return res.status(200).json({ success: true, user: userObj });
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};

export const getUserNumber = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId)
      return res
        .status(404)
        .json({ success: false, message: "User Id is required!" });

    const user = await UserModel.findById(userId).select(
      "number isNumberVerified"
    );

    if (user)
      return res.status(200).json({
        success: true,
        number: user.number,
        isNumberVerified: user.isNumberVerified,
      });

    return res.status(404).json({ success: false, message: "user not found!" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};

export const sendOtp = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId)
      return res
        .status(404)
        .json({ success: false, message: "User Id is required!" });

    const user = await UserModel.findById(userId);

    const randomAlphaNumeric = uuidv4();
    const otp = randomAlphaNumeric.toUpperCase().slice(0, 6);
    const message = `Hi, ${user?.name} your E-Commerce verification otp is - ${otp} `;

    if (user) {
      const responseFromTwilio = sendTwilioMessage(user.number, message);
      // console.log(responseFromTwilio);
      if (responseFromTwilio) {
        user.otpForNumberVerification = otp;
        await user.save();
        return res.status(200).json({
          success: true,
          message: "OTP has been sent to your registered number!",
        });
      }
    }

    return res.status(404).json({ success: false, message: "User not found!" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { userId } = req.body;
    const { otpNumber } = req.body;

    if (!userId)
      return res
        .status(404)
        .json({ success: false, message: "User Id is required!" });

    if (!otpNumber)
      return res
        .status(404)
        .json({ success: false, message: "OTP number is required!" });

    const user = await UserModel.findById(userId);

    if (user) {
      if (user.otpForNumberVerification == otpNumber) {
        user.isNumberVerified = true;
        await user.save();
        return res.status(200).json({
          success: true,
          isNumberVerified: user.isNumberVerified,
          message: "OTP verified successfully!",
        });
      }

      return res
        .status(404)
        .json({ success: false, message: "Not a valid OTP number!" });
    }

    return res
      .status(404)
      .json({ success: false, message: "Not a valid user!" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};
