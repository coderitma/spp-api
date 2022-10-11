const express = require("express");
const { generateID } = require("../../cores/helpers");
const { isAuthenticated } = require("../../cores/permissions");
const MobilModel = require("./models");
const {
  validateMobilBeforeCreate,
  validateMobilBeforeUpdate,
} = require("./validations");

const MobilController = express.Router();
const PREFIX = "MBL";

MobilController.get("/id", [isAuthenticated], async (req, res) => {
  try {
    let kode = await generateID(PREFIX, MobilModel);
    return res.json({ kode });
  } catch (error) {
    return res.status(400).json(error);
  }
});

MobilController.post("/", [validateMobilBeforeCreate], async (req, res) => {
  try {
    await new MobilModel(req.body).save();
    return res.status(201).json(req.body);
  } catch (error) {
    return res.status(400).json(error);
  }
});

MobilController.get("/", [isAuthenticated], async (req, res) => {
  try {
    let daftarMobil = await MobilModel.find(req.query, { _id: 0 });
    return res.json(daftarMobil);
  } catch (error) {
    res.status(400).json(error);
  }
});

MobilController.get("/:kode", [isAuthenticated], async (req, res, next) => {
  try {
    let mobil = await MobilModel.find({ kode: req.params.kode }, { _id: 0 });

    return res.json(mobil);
  } catch (error) {
    return res.status(400).json(error);
  }
});

MobilController.put(
  "/:kode",
  [isAuthenticated, validateMobilBeforeUpdate],
  async (req, res) => {
    try {
      await MobilModel.findOneAndUpdate({ kode: req.params.kode }, req.body);
      let mobil = await MobilModel.findOne(
        { kode: req.params.kode },
        { _id: 0 }
      );
      return res.json(mobil);
    } catch (error) {
      return res.status(400).json(error);
    }
  }
);

MobilController.delete("/:kode", [isAuthenticated], async (req, res) => {
  try {
  } catch (error) {
    return res.status(400).json(error);
  }
});

module.exports = MobilController;
