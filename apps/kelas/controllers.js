const express = require("express");
const { isAuthenticated } = require("../../cores/permissions");
const KelasController = express.Router();
const GuruModel = require("../guru/models");
const KelasModel = require("./models");

KelasController.post("/", async (req, res) => {
  try {
    // periksa kode
    if (!req.body.kode) {
      return res.status(400).json({ message: "Kode harus disertakan." });
    }

    // periksa nama
    if (!req.body.nama) {
      return res.status(400).json({ message: "Nama harus disertakan." });
    }

    // periksa guru
    if (!req.body.guru) {
      return res.status(400).json({ message: "Guru harus disertakan." });
    }

    // ambil guru
    let guru = await GuruModel.findOne({ kode: req.body.guru }, { _id: 0 });

    // periksa guru, jika tidak ada
    if (!guru) {
      return res.status(404).json({ message: "Kode guru tidak ditemukan." });
    }

    // periksa kode, jika sudah pernah dibuat, maka
    if (await KelasModel.findOne({ kode: req.body.kode })) {
      return res.status(400).json({ message: "Kode sudah terdaftar." });
    }

    await new KelasModel({
      kode: req.body.kode,
      guru: guru.kode,
      nama: req.body.nama,
    }).save();
    return res.status(201).json(req.body);
  } catch (error) {
    return res.status(400).json(error);
  }
});

KelasController.get("/", [isAuthenticated], async (req, res) => {
  try {
    let daftarKelas = await KelasModel.find(null, { _id: 0, __v: 0 });
    return res.json(daftarKelas);
  } catch (error) {
    return res.status(400).json(error);
  }
});

KelasController.get("/:kode", [isAuthenticated], async (req, res) => {
  try {
    let kelas = await KelasModel.findOne(
      { kode: req.params.kode },
      { _id: 0, __v: 0 }
    );

    if (!kelas) {
      return res.status(404).json({ message: "Kelas tidak ditemukan." });
    }

    return res.json(kelas);
  } catch (error) {
    return res.status(400).json(error);
  }
});

KelasController.put("/:kode", [isAuthenticated], async (req, res) => {
  try {
    let kelas = await KelasModel.findOne({ kode: req.params.kode });

    if (!kelas) {
      return res.status(404).json({ message: "Kelas tidak ditemukan." });
    }

    // ambil guru
    let guru = await GuruModel.findOne({ kode: req.body.guru }, { _id: 0 });

    // periksa guru, jika tidak ada
    if (!guru) {
      return res.status(404).json({ message: "Guru tidak ditemukan." });
    }

    const data = {
      nama: req.body.nama,
      guru: req.body.guru,
    };

    await KelasModel.findOneAndUpdate({ kode: kelas.kode }, data);
    return res.json(data);
  } catch (error) {
    return res.status(400).json(error);
  }
});

KelasController.delete("/:kode", [isAuthenticated], async (req, res) => {
  try {
    let kelas = await KelasModel.findOne({ kode: req.params.kode });

    if (!kelas) {
      return res.status(404).json({ message: "Kelas tidak ditemukan." });
    }

    await KelasModel.findOneAndRemove({ kode: kelas.kode });
    return res.status(204).json({});
  } catch (error) {
    return res.status(400).json(error);
  }
});

module.exports = KelasController;
