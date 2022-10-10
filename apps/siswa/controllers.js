const express = require("express");
const KelasModel = require("../kelas/models");

const SPPModel = require("../spp/models");
const SiswaModel = require("./models");

const { isAuthenticated } = require("../../cores/permissions");
const { getMonthName, generateCounterID } = require("../../cores/helpers");

const SiswaController = express.Router();

SiswaController.post("/", [isAuthenticated], async (req, res) => {
  try {
    // ambil data kelas
    let kelas = await KelasModel.findOne({ kode: req.body.kelas });
    // ambil tahun ajaran
    let tahunAjaran = new Date().getFullYear();
    // ambil siswa dari nis
    let siswa = await SiswaModel.findOne({ nis: req.body.nis });

    // periksa apakah kelas ada, jika tidak
    if (!kelas) {
      return res.status(404).json({ message: "Kelas not found" });
    }

    // jika tahun ajaran tidak valid
    if (tahunAjaran != req.body.tahunAjaran) {
      return res.status(400).json({ message: "Tahun ajaran tidak valid" });
    }

    // periksa apakah nis sudah terdaftar, jika sudah
    if (siswa) {
      return res.status(400).json({ message: "NIS sudah pernah terdaftar" });
    }

    // save siswa jika sudah aman
    await new SiswaModel(req.body).save();

    siswa = await SiswaModel.findOne({ nis: req.body.nis });

    // menggenerate spp
    let data = await generateCounterID(SPPModel, "SPP");
    let spp = [];
    let year = new Date().getFullYear();
    let bulanTahunAjaran = [6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5];
    for (nomor in data) {
      if (bulanTahunAjaran[nomor] === 0) {
        year = year + 1;
      }
      spp.push({
        nomor: data[nomor],
        jatuhTempo: new Date(year, bulanTahunAjaran[nomor], 10),
        bulan: await getMonthName(bulanTahunAjaran[nomor]),
        biaya: req.body.biaya,
        status: false,
        tahunAjaran: `${req.body.tahunAjaran}`,
        nis: siswa.nis,
        namaSiswa: siswa.nama,
        kodeKelas: kelas.kode,
        namaKelas: kelas.nama,
        user: req.user.email,
      });
    }

    await SPPModel.insertMany(spp);

    return res.status(201).json(req.body);
  } catch (error) {
    // remove data
    await SiswaModel.findOneAndDelete({ nis: req.body.nis });
    await SPPModel.deleteMany({ siswa: req.body.nis });
    return res.status(400).json(error);
  }
});

SiswaController.get("/", [isAuthenticated], async (req, res) => {
  try {
    let daftarSiswa = await SiswaModel.find(null, { _id: 0, __v: 0 });
    return res.status(201).json(daftarSiswa);
  } catch (error) {
    res.status(400).json(error);
  }
});

SiswaController.get("/:nis", [isAuthenticated], async (req, res) => {
  try {
    let siswa = await SiswaModel.findOne(
      { nis: req.params.nis },
      { _id: 0, __v: 0 }
    );
    if (!siswa) {
      return res.status(404).json({ message: "Siswa not found!" });
    }

    return res.json(siswa);
  } catch (error) {
    return res.status(400).json(error);
  }
});

SiswaController.put("/:nis", [isAuthenticated], async (req, res) => {
  try {
    let siswa = await SiswaModel.findOne(
      { kode: req.params.siswa },
      { _id: 0, __v: 0 }
    );
    if (!siswa) {
      return res.status(404).json({ message: "Siswa not found!" });
    }

    const data = { nama: req.body.nama };
    await SiswaModel.findOneAndUpdate({ nis: req.params.nis }, data);
    siswa = await SiswaModel.findOne(
      { nis: req.params.nis },
      { _id: 0, __v: 0 }
    );
    return res.json(siswa);
  } catch (error) {
    return res.status(400).json(error);
  }
});

module.exports = SiswaController;
