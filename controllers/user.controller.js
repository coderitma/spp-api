const express = require("express");
const UserModel = require("../models/user.model");
const router = express.Router();
const { authenticated, makeToken, makePassword } = require("../utils/auth");

router.post("/", async (req, res) => {
  const passwordSalt = await makePassword(req.body.password);

  const newUser = new UserModel({
    email: req.body.email, 
    nama: req.body.nama,
    ...passwordSalt, 
    isActive: true
  });

  await newUser.save();
  
  return res.status(201).json({ 
    email: req.body.email, 
    nama:  req.body.nama
  })
})

router.post("/signin", async (req, res) => {
  const user = await authenticated(req);

  if (user) { 
    res.status(201).json({ token: await makeToken(user) }) 
  } else {
    res.status(401).json({message: "otentikasi gagal, silahkan coba kembali"})
  }
})


module.exports = router