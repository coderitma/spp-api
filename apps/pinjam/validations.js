const { body, validationResult, param } = require("express-validator");
const MobilModel = require("../mobil/models");
const PinjamModel = require("./models");

exports.validatePinjamBeforeCreate = async (req, res, next) => {
  let validators = [
    body("kode")
      .exists()
      .withMessage("Field kode harus tersedia")
      .bail()
      .notEmpty()
      .withMessage("Kode tidak boleh kosong")
      .bail()
      .custom(async (value) => {
        if (await PinjamModel.findOne({ kode: value })) {
          return Promise.reject("Kode pinjam sudah pernah dibuat");
        }
      }),
    body("tanggalPinjam")
      .exists()
      .withMessage("Field tanggal pinjam harus tersedia")
      .bail()
      .notEmpty()
      .withMessage("Tanggal pinjam tidak boleh kosong")
      .bail()
      .isISO8601()
      .withMessage("Format tanggal harus sesuai")
      .bail()
      .toDate(),
    body("kartuKeluarga")
      .exists()
      .withMessage("Field kartu keluarga harus tersedia")
      .bail()
      .notEmpty()
      .withMessage("Kartu keluarga tidak boleh kosong"),
    body("ktp")
      .exists()
      .withMessage("Field KTP harus tersedia")
      .bail()
      .notEmpty()
      .withMessage("KTP tidak boleh kosong"),
    body("namaCustomer")
      .exists()
      .withMessage("Field Nama customer harus tersedia")
      .bail()
      .notEmpty()
      .withMessage("Nama customer tidak boleh kosong"),
    body("alamat")
      .exists()
      .withMessage("Field alamat harus tersedia")
      .bail()
      .notEmpty()
      .withMessage("Alamat tidak boleh kosong"),
    body("nomorHP")
      .exists()
      .withMessage("Field nomor HP harus tersedia")
      .bail()
      .notEmpty()
      .withMessage("Nomor HP tidak boleh kosong"),
    body("kodeMobil")
      .exists()
      .withMessage("Field kode mobil harus tersedia")
      .bail()
      .notEmpty()
      .withMessage("Kode mobil tidak boleh kosong")
      .bail()
      .custom(async (value) => {
        let mobil = await MobilModel.findOne({ kode: value });
        if (!mobil) {
          return Promise.reject("Mobil tidak tersedia");
        }

        if (!mobil.status) {
          return Promise.reject("Mobil ini sedang digunakan");
        }
      }),
    body("namaMobil")
      .exists()
      .withMessage("Field nama mobil harus tersedia")
      .bail()
      .notEmpty()
      .withMessage("Nama mobil tidak boleh kosong")
      .bail()
      .custom(async (value, { req }) => {
        let mobil = await MobilModel.findOne({ kode: req.body.kodeMobil });
        if (mobil.nama != value) {
          return Promise.reject("Nama mobil tidak valid");
        }
      }),
    body("tarifJam")
      .exists()
      .withMessage("Field tarif jam harus tersedia")
      .bail()
      .notEmpty()
      .withMessage("Tarif jam tidak boleh kosong")
      .bail()
      .toInt()
      .custom(async (value, { req }) => {
        let mobil = await MobilModel.findOne({ kode: req.body.kodeMobil });
        if (mobil.tarifJam !== value) {
          return Promise.reject("Tarif jam mobil tidak valid");
        }
      }),
    body("tarifHari")
      .exists()
      .withMessage("Field tarif hari harus tersedia")
      .bail()
      .notEmpty()
      .withMessage("Tarif hari tidak boleh kosong")
      .bail()
      .toInt()
      .custom(async (value) => {
        let mobil = await MobilModel.findOne({ kode: req.body.kodeMobil });
        if (mobil.tarifHari !== value) {
          return Promise.reject("Tarif hari mobil tidak valid");
        }
      }),
    body("durasi")
      .exists()
      .withMessage("Field lama pinjam harus tersedia")
      .bail()
      .notEmpty()
      .withMessage("Lama pinjam boleh kosong")
      .bail()
      .isIn(["hari", "jam"])
      .withMessage("Durasi harus hari atau jam"),
    body("lamaPinjam")
      .exists()
      .withMessage("Field lama pinjam harus tersedia")
      .bail()
      .notEmpty()
      .withMessage("Lama pinjam boleh kosong")
      .bail()
      .isInt()
      .custom(async (value, { req }) => {
        if (req.body.durasi === "hari") {
          if (value < 2) {
            return Promise.reject("Lama pinjam minimal 2 hari");
          }
        } else {
          if (value <= 2) {
            return Promise.reject("Lama pinjam minimal 3 jam");
          }
        }
      }),
    body("totalBiaya")
      .exists()
      .withMessage("Field total biaya harus tersedia")
      .bail()
      .notEmpty()
      .withMessage("Total biaya boleh kosong")
      .bail()
      .isInt()
      .custom(async (value, { req }) => {
        let mobil = await MobilModel.findOne({ kode: req.body.kodeMobil });
        let totalBiaya = 0;
        if (req.body.durasi === "hari") {
          totalBiaya = mobil.tarifHari * req.body.lamaPinjam;
        } else {
          totalBiaya = mobil.tarifJam * req.body.lamaPinjam;
        }

        if (totalBiaya !== value) {
          return Promise.reject("Total biaya tidak valid!");
        }
      }),
    body("uangMuka")
      .exists()
      .withMessage("Field uang muka harus tersedia")
      .bail()
      .notEmpty()
      .withMessage("Uang muka boleh kosong")
      .bail()
      .isInt()
      .custom(async (value) => {
        if (value <= 0) {
          Promise.reject("Uang muka tidak boleh 0");
        }
      }),
    body("sisa")
      .exists()
      .withMessage("Field sisa harus tersedia")
      .bail()
      .notEmpty()
      .withMessage("Sisa tidak boleh kosong")
      .bail()
      .toInt()
      .custom(async (value, { req }) => {
        let sisa =
          req.body.uangMuka > req.body.totalBiaya
            ? 0
            : req.body.totalBiaya - req.body.uangMuka;
        if (value !== sisa) {
          return Promise.reject("Sisa peminjaman tidak valid");
        }
      }),
    body("tanggalBerangkat")
      .exists()
      .withMessage("Field tanggal berangkat harus tersedia")
      .bail()
      .notEmpty()
      .withMessage("Tanggal berangkat tidak boleh kosong")
      .bail()
      .isISO8601()
      .withMessage("Format tanggal harus sesuai")
      .bail()
      .toDate()
      .custom(async (value, { req }) => {
        if (value.getTime() <= req.body.tanggalPinjam.getTime()) {
          return Promise.reject(
            "Tanggal berangkat minimal harus satu hari setelah tanggal pinjam"
          );
        }
      }),
    body("jamBerangkat")
      .exists()
      .withMessage("Field jam berangkat harus tersedia")
      .bail()
      .notEmpty()
      .withMessage("Jam berangkat tidak boleh kosong"),
    body("statusPinjam")
      .exists()
      .withMessage("Field status pinjam harus tersedia")
      .bail()
      .notEmpty()
      .withMessage("Status pinjam tidak boleh kosong")
      .bail()
      .isIn(["batal", "booking", "jalan"])
      .withMessage("Status pinjam harus menjadi batal, booking atau jalan"),
  ];

  for (let validation of validators) {
    const result = await validation.run(req);
    // if (result.errors.length) break;
  }

  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  return res.status(400).json({ errors: errors.array() });
};

exports.validatePinjamBeforeUpdate = async (req, res, next) => {
  let validators = [
    param("kode")
      .exists()
      .withMessage("Field kode harus tersedia")
      .bail()
      .notEmpty()
      .withMessage("Kode tidak boleh kosong")
      .bail()
      .custom(async (value) => {
        if (!(await PinjamModel.findOne({ kode: value }))) {
          return Promise.reject("Peminjaman tidak tersedia");
        }
      })
      .custom(async (value) => {
        let pinjam = await PinjamModel.findOne({ kode: value });
        if (pinjam.statusPinjam === "jalan") {
          return Promise.reject(
            "Peminjaman sedang berjalan tidak diizinkan diubah"
          );
        }
      }),
    body("tanggalPinjam")
      .exists()
      .withMessage("Field tanggal pinjam harus tersedia")
      .bail()
      .notEmpty()
      .withMessage("Tanggal pinjam tidak boleh kosong")
      .bail()
      .isISO8601()
      .withMessage("Format tanggal harus sesuai")
      .bail()
      .toDate(),
    body("kartuKeluarga")
      .exists()
      .withMessage("Field kartu keluarga harus tersedia")
      .bail()
      .notEmpty()
      .withMessage("Kartu keluarga tidak boleh kosong"),
    body("ktp")
      .exists()
      .withMessage("Field KTP harus tersedia")
      .bail()
      .notEmpty()
      .withMessage("KTP tidak boleh kosong"),
    body("namaCustomer")
      .exists()
      .withMessage("Field Nama customer harus tersedia")
      .bail()
      .notEmpty()
      .withMessage("Nama customer tidak boleh kosong"),
    body("alamat")
      .exists()
      .withMessage("Field alamat harus tersedia")
      .bail()
      .notEmpty()
      .withMessage("Alamat tidak boleh kosong"),
    body("nomorHP")
      .exists()
      .withMessage("Field nomor HP harus tersedia")
      .bail()
      .notEmpty()
      .withMessage("Nomor HP tidak boleh kosong"),
    body("kodeMobil")
      .exists()
      .withMessage("Field kode mobil harus tersedia")
      .bail()
      .notEmpty()
      .withMessage("Kode mobil tidak boleh kosong")
      .bail()
      .custom(async (value) => {
        let mobil = await MobilModel.findOne({ kode: value });
        if (!mobil) {
          return Promise.reject("Mobil tidak tersedia");
        }

        if (!mobil.status) {
          return Promise.reject("Mobil ini sedang digunakan");
        }
      }),
    body("namaMobil")
      .exists()
      .withMessage("Field nama mobil harus tersedia")
      .bail()
      .notEmpty()
      .withMessage("Nama mobil tidak boleh kosong")
      .bail()
      .custom(async (value, { req }) => {
        let mobil = await MobilModel.findOne({ kode: req.body.kodeMobil });
        if (mobil.nama != value) {
          return Promise.reject("Nama mobil tidak valid");
        }
      }),
    body("tarifJam")
      .exists()
      .withMessage("Field tarif jam harus tersedia")
      .bail()
      .notEmpty()
      .withMessage("Tarif jam tidak boleh kosong")
      .bail()
      .toInt()
      .custom(async (value, { req }) => {
        let mobil = await MobilModel.findOne({ kode: req.body.kodeMobil });
        if (mobil.tarifJam !== value) {
          return Promise.reject("Tarif jam mobil tidak valid");
        }
      }),
    body("tarifHari")
      .exists()
      .withMessage("Field tarif hari harus tersedia")
      .bail()
      .notEmpty()
      .withMessage("Tarif hari tidak boleh kosong")
      .bail()
      .toInt()
      .custom(async (value) => {
        let mobil = await MobilModel.findOne({ kode: req.body.kodeMobil });
        if (mobil.tarifHari !== value) {
          return Promise.reject("Tarif hari mobil tidak valid");
        }
      }),
    body("durasi")
      .exists()
      .withMessage("Field lama pinjam harus tersedia")
      .bail()
      .notEmpty()
      .withMessage("Lama pinjam boleh kosong")
      .bail()
      .isIn(["hari", "jam"])
      .withMessage("Durasi harus hari atau jam"),
    body("lamaPinjam")
      .exists()
      .withMessage("Field lama pinjam harus tersedia")
      .bail()
      .notEmpty()
      .withMessage("Lama pinjam boleh kosong")
      .bail()
      .isInt()
      .custom(async (value, { req }) => {
        if (req.body.durasi === "hari") {
          if (value < 2) {
            return Promise.reject("Lama pinjam minimal 2 hari");
          }
        } else {
          if (value <= 2) {
            return Promise.reject("Lama pinjam minimal 3 jam");
          }
        }
      }),
    body("totalBiaya")
      .exists()
      .withMessage("Field total biaya harus tersedia")
      .bail()
      .notEmpty()
      .withMessage("Total biaya boleh kosong")
      .bail()
      .isInt()
      .custom(async (value, { req }) => {
        let mobil = await MobilModel.findOne({ kode: req.body.kodeMobil });
        let totalBiaya = 0;
        if (req.body.durasi === "hari") {
          totalBiaya = mobil.tarifHari * req.body.lamaPinjam;
        } else {
          totalBiaya = mobil.tarifJam * req.body.lamaPinjam;
        }

        if (totalBiaya !== value) {
          return Promise.reject("Total biaya tidak valid!");
        }
      }),
    body("uangMuka")
      .exists()
      .withMessage("Field uang muka harus tersedia")
      .bail()
      .notEmpty()
      .withMessage("Uang muka boleh kosong")
      .bail()
      .isInt()
      .custom(async (value) => {
        if (value <= 0) {
          Promise.reject("Uang muka tidak boleh 0");
        }
      }),
    body("sisa")
      .exists()
      .withMessage("Field sisa harus tersedia")
      .bail()
      .notEmpty()
      .withMessage("Sisa tidak boleh kosong")
      .bail()
      .toInt()
      .custom(async (value, { req }) => {
        let sisa =
          req.body.uangMuka > req.body.totalBiaya
            ? 0
            : req.body.totalBiaya - req.body.uangMuka;
        if (value !== sisa) {
          return Promise.reject("Sisa peminjaman tidak valid");
        }
      }),
    body("tanggalBerangkat")
      .exists()
      .withMessage("Field tanggal berangkat harus tersedia")
      .bail()
      .notEmpty()
      .withMessage("Tanggal berangkat tidak boleh kosong")
      .bail()
      .isISO8601()
      .withMessage("Format tanggal harus sesuai")
      .bail()
      .toDate()
      .custom(async (value, { req }) => {
        if (value.getTime() <= req.body.tanggalPinjam.getTime()) {
          return Promise.reject(
            "Tanggal berangkat minimal harus satu hari setelah tanggal pinjam"
          );
        }
      }),
    body("jamBerangkat")
      .exists()
      .withMessage("Field jam berangkat harus tersedia")
      .bail()
      .notEmpty()
      .withMessage("Jam berangkat tidak boleh kosong"),
    body("statusPinjam")
      .exists()
      .withMessage("Field status pinjam harus tersedia")
      .bail()
      .notEmpty()
      .withMessage("Status pinjam tidak boleh kosong")
      .bail()
      .isIn(["batal", "booking", "jalan"])
      .withMessage("Status pinjam harus menjadi batal, booking atau jalan"),
  ];

  for (let validation of validators) {
    await validation.run(req);
  }

  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  return res.status(400).json({ errors: errors.array() });
};

exports.validatePinjamBeforeGet = async (req, res, next) => {
  let validators = [
    param("kode")
      .exists()
      .withMessage("Parameter kode harus tersedia")
      .bail()
      .notEmpty()
      .withMessage("Kode tidak boleh kosong")
      .bail()
      .custom(async (value) => {
        if (!(await PinjamModel.findOne({ kode: value }))) {
          return Promise.reject("Peminjaman tidak tersedia");
        }
      }),
  ];

  for (let validation of validators) {
    await validation.run(req);
  }

  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  return res.status(400).json({ errors: errors.array() });
};
