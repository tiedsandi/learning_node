const express = require("express");
const router = express.Router();
var jwt = require("jsonwebtoken");
// const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");

const UserModel = require("../models/user");

router.post("/signup", async (req, res, next) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new UserModel({
    email: req.body.email,
    password: hashedPassword,
  });

  const savedUser = await user.save();

  res.status(201).json({ message: "User registered", user: savedUser });
});

router.post("/login", async (req, res, next) => {
  let { email, password } = req.body;

  let user = await UserModel.findOne({ email: email });

  if (user == undefined) {
    return res.status(200).json({
      status: false,
      message: "Email not found",
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({
      status: false,
      message: "Invalid password",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.JWT_KEY,
    { expiresIn: "1D" }
  );

  res.status(200).json({
    status: true,
    message: "Login successful",
    token: token,
  });
});

router.delete("/:userId", async (req, res, next) => {
  const id = req.params.userId;
  await UserModel.findByIdAndDelete(id).exec();
  res.status(200).json({
    message: "Deleted User!",
  });
});

module.exports = router;
