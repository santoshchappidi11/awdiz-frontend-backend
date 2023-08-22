import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./Model/User.model.js";

const app = express();
dotenv.config();
app.use(express.json());

app.get("/", function (req, res) {
  res.send("This is home");
});

app.post("/login", function (req, res) {
  res.send("This is login");
});

app.post("/register", async function (req, res) {
  console.log(req.body, "request.body");
  const { name, surname, age, email, number, password, confirmPassword } =
    req.body;

  if (!name) return res.send("Name is missing...");
  if (!surname) return res.send("Surname is missing...");
  if (!age) return res.send("Age is missing...");
  if (!email) return res.send("Email is required...");
  if (!number) return res.send("Number is required...");
  if (!password) return res.send("Password is required...");
  if (!confirmPassword) return res.send("Confirm password is required...");
  if (password !== confirmPassword)
    return res.send("Password and Confirm Password does not match!");

  const user = new User({
    name: name,
    surname: surname,
    age: parseInt(age),
    email: email,
    number: parseInt(number),
    password: password,
  });

  await user.save();

  res.send("Registration done successfully!");
});

app.get("/find", async (req, res) => {
  const { email } = req.body;

  if (!email) return res.send("Email not found!");

  const user = await User.find({ email: email }).select("-password");
  if (user.length) {
    return res.send(user[0]);
  }
  return res.send("No user found!");
});

app.patch("/update/:id", async (req, res) => {
  const { age, number } = req.body;
  const { id } = req.params;

  if (!id) return res.send("Id is required!");
  if (!age) return res.send("Age is required!");
  if (!number) return res.send("Number is required!");

  const updateUser = await User.findByIdAndUpdate(
    id,
    { age, number },
    { new: true }
  ).select("-password");

  return res.json({ message: "Updated User", data: updateUser });
});

app.put("/update/:id", async (req, res) => {
  const { name, surname } = req.body;
  const { id } = req.params;

  if (!id) return res.send("Id is required!");
  if (!name) return res.send("name is required!");
  if (!surname) return res.send("surname is required!");

  const updateUser = await User.findByIdAndUpdate(
    id,
    { name, surname },
    { new: true }
  ).select("-password");

  return res.json({ message: "Updated User", data: updateUser });
});

app.delete("/delete", async (req, res) => {
  const { id } = req.body;

  if (!id) return res.send("name is required!");

  const deleteUser = await User.findByIdAndDelete(id);
  return res.json({ message: "User Deleted", data: deleteUser });
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to DB...");
  })
  .catch((error) => {
    console.log("Error while connecting to DB", error);
  });

app.listen(8000, () => {
  console.log("server listening on port 8000");
});
