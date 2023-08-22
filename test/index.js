import express from "express";
import { Login, Register } from "./controllers/User.controller.js";
import { Home } from "./controllers/Home.controller.js";
import mongoose from "mongoose";

const app = express();

app.get("/", Home);
app.get("/login", Login);
app.get("/register", Register);

mongoose
  .connect(
    "mongodb+srv://santosh:santosh123@cluster0.0tasyyd.mongodb.net/awdiz"
  )
  .then(() => {
    console.log("connected to DB...");
  })
  .catch((error) => {
    console.log("Error while connecting to mongoDB", error);
  });

app.listen(8000, () => {
  console.log("server running on port 8000");
});
