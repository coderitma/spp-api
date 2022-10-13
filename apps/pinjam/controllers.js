const express = require("express");
// const { generateID } = require("../../cores/helpers");
const { isAuthenticated } = require("../../cores/permissions");
const PinjamModel = require("./models");
const {
  calculatePinjamBeforeCreate,
  calculatePinjamAfterCreate,
  calculatePinjamBeforeUpdate,
} = require("./services");
const {
  validatePinjamBeforeCreate,
  validatePinjamBeforeUpdate,
  validatePinjamBeforeGet,
} = require("./validations");

const PinjamController = express.Router();
// const PREFIX = "PJM";

PinjamController.post(
  "/",
  [isAuthenticated, validatePinjamBeforeCreate],
  async (req, res) => {
    try {
      req.body.user = req.user.email;
      await calculatePinjamBeforeCreate(req);
      await new PinjamModel(req.body).save();
      await calculatePinjamAfterCreate(req);
      let pinjam = await PinjamModel.findOne(
        { kode: req.body.kode },
        { user: 0, _id: 0 }
      );
      return res.status(201).json(pinjam);
    } catch (error) {
      return res.status(400).json(error);
    }
  }
);

PinjamController.get("/", [isAuthenticated], async (req, res) => {
  try {
    let daftarPinjam = await PinjamModel.find();
    return res.json(daftarPinjam);
  } catch (error) {
    res.status(400).json(error);
  }
});

PinjamController.get(
  "/:kode",
  [isAuthenticated, validatePinjamBeforeGet],
  async (req, res) => {
    try {
      let pinjam = await PinjamModel.findOne({ kode: req.params.kode });
      return res.json(pinjam);
    } catch (error) {
      return res.status(400).json(error);
    }
  }
);

PinjamController.put(
  "/:kode",
  [isAuthenticated, validatePinjamBeforeUpdate],
  async (req, res) => {
    try {
      await calculatePinjamBeforeUpdate(req);
      await PinjamModel.findOneAndUpdate({ kode: req.params.kode }, req.body);
      return res.json(req.body);
    } catch (error) {
      return res.status(400).json(error);
    }
  }
);

module.exports = PinjamController;
