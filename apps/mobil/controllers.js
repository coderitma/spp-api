const { isAuthenticated } = require("../../cores/permissions/middlewares");

const express = require("express");
const { ValidateMobilBeforeCreate } = require("./validations");
const MobilController = express.Router();

MobilController.post("/", [isAuthenticated], async (req, res) => {
  try {
    let validations = await ValidateMobilBeforeCreate(req);

    if (!validations.isValid) {
      return res.status(400).json(validations.messages);
    }

    return res.status(201).json(req.body);
  } catch (error) {
    return res.status(400).json(error);
  }
});

MobilController.get("/", [isAuthenticated], async (req, res) => {
  try {
  } catch (error) {
    res.status(400).json(error);
  }
});

MobilController.get("/:kode", [isAuthenticated], async (req, res) => {
  try {
  } catch (error) {
    return res.status(400).json(error);
  }
});

MobilController.put("/:kode", [isAuthenticated], async (req, res) => {
  try {
  } catch (error) {
    return res.status(400).json(error);
  }
});

MobilController.delete("/:kode", [isAuthenticated], async (req, res) => {
  try {
  } catch (error) {
    return res.status(400).json(error);
  }
});

module.exports = MobilController;
