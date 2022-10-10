const express = require("express");
const { isAuthenticated } = require("../../cores/permissions");

const SiswaModel = require("../siswa/models");
const SPPModel = require("./models");
const SPPController = express.Router();

SPPController.get("/", [isAuthenticated], async (req, res) => {
  try {
    // periksa nis siswa
    let siswa = await SiswaModel.findOne({ nis: { $eq: req.query.nis } });
    if (!siswa) {
      return res.status(404).json({ message: "Nis tidak terdaftar!" });
    }

    // ambil spp
    let daftarSPP = await SPPModel.find(
      { nis: req.query.nis, tahunAjaran: req.query.tahunAjaran },
      { _id: 0, __v: 0 }
    );
    if (!daftarSPP) {
      return res.status(404).json("Siswa belum ada kartu SPP");
    }

    return res.json(daftarSPP);
  } catch (error) {
    return res.status(404).json(error);
  }
});

SPPController.put("/:nomor", async (req, res) => {
  try {
    // ambil spp
    let spp = await SPPModel.findOne(
      { nomor: req.params.nomor },
      { __v: 0, _id: 0 }
    );
    if (!spp) {
      return res.status(404).json({ message: "SPP tidak ditemukan" });
    }

    if (spp.status) {
      return res.status(400).json({ message: "SPP sudah dibayar" });
    }

    // buat tanggal bayar
    let tanggalBayar = new Date();

    // menyiapkan variabel jika sudah melebihi batas
    // tempo pembayaran
    let keterangan = "Pembayaran Lunas";

    // memeriksa pembayaran
    // memeriksa apakan pembayaran sudah melebihi jatuh tempo,
    if (tanggalBayar > spp.jatuhTempo) {
      keterangan = "Melunasi tunggakan";
    }

    await SPPModel.findOneAndUpdate(
      { nomor: req.params.nomor },
      {
        status: true,
        jumlah: spp.biaya,
        tanggalBayar,
        keterangan,
      }
    );

    return res.json(spp);
  } catch (error) {
    await SPPModel.findOneAndDelete({ nomor: req.params.nomor });
    return res.status(404).json(error);
  }
});

module.exports = SPPController;
