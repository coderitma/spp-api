const express = require("express");
const { makePassword, makeToken, authenticated } = require("./authentications");

const UserController = express.Router();
const UserModel = require("./models");

UserController.post("/", async (req, res) => {
  const passwordSalt = await makePassword(req.body.password);

  const newUser = new UserModel({
    email: req.body.email,
    nama: req.body.nama,
    ...passwordSalt,
    isActive: true,
  });

  await newUser.save();

  return res.status(201).json({
    email: req.body.email,
    nama: req.body.nama,
  });
});

UserController.get("/", async (req, res) => {
  let data = await UserModel.find();
  res.json(data);
});

UserController.post("/signin", async (req, res) => {
  const user = await authenticated(req);

  if (user) {
    res.json({ token: await makeToken(user) });
  } else {
    res
      .status(401)
      .json({ message: "otentikasi gagal, silahkan coba kembali" });
  }
});

module.exports = UserController;
