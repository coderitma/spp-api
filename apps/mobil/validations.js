const MobilModel = require("./models");
const { body, validationResult, param } = require("express-validator");

exports.validateMobilBeforeCreate = async (req, res, next) => {
  let validators = [
    body("kode")
      .exists()
      .withMessage("must be available")
      .bail()
      .isLength({ min: 5 })
      .withMessage("must be at least 5 chars long")
      .bail()
      .custom(async (value, { req }) => {
        let mobil = await MobilModel.findOne({ kode: value });
        if (mobil) {
          return Promise.reject("Mobil is available");
        }
      }),
    body("nomorPlat")
      .exists()
      .withMessage("nomorPlat harus disertakan")
      .bail()
      .notEmpty()
      .withMessage("nomor plat tidak boleh kosong")
      .bail()
      .isLength({ max: 15 })
      .withMessage("nomor plat tidak boleh melebihi 15 karakter")
      .bail()
      .custom(async (value, { req }) => {
        let mobil = await MobilModel.findOne({ nomorPlat: value });
        if (mobil) {
          return Promise.reject(`Mobil dengan nomor ${value} sudah ada`);
        }
      }),
    body("nama")
      .exists()
      .notEmpty()
      .withMessage("Nama must be ")
      .bail()
      .isLength({ min: 3 }),
    body("tarifJam")
      .notEmpty()
      .withMessage("Tarif jam wajib ada!")
      .bail()
      .isNumeric()
      .withMessage("must be number")
      .bail()
      .toInt()
      .custom(async (value, { req }) => {
        console.log(typeof value, value);
        if (value < 40000) {
          return Promise.reject(`${value} must be greater than ${40000}`);
        }
      }),
    body("tarifHari")
      .notEmpty()
      .bail()
      .isNumeric()
      .withMessage("must be number")
      .bail()
      .toInt()
      .custom(async (value, { req }) => {
        console.log(typeof value, value);
        if (value < 90000) {
          return Promise.reject(`${value} must be greater than ${90000}`);
        }
      }),
    body("status")
      .exists()
      .withMessage("status must be available on the body")
      .bail()
      .isBoolean()
      .withMessage("Status must be boolean true or false"),
  ];
  // untuk berhasil, client harus menyedikana token dari mana
  // untuk diproses di sini.
  // TODO: remove this code after i upgrade node version
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

exports.validateMobilBeforeUpdate = async (req, res, next) => {
  let validators = [
    param("kode")
      .exists()
      .withMessage("must be available")
      .bail()
      .isLength({ min: 5 })
      .withMessage("must be at least 5 chars long")
      .bail()
      .custom(async (value, { req }) => {
        let mobil = await MobilModel.findOne({ kode: value });
        if (!mobil) {
          return Promise.reject("Mobil not available");
        }
      }),
    body("nomorPlat")
      .exists()
      .withMessage("nomorPlat harus disertakan")
      .bail()
      .notEmpty()
      .withMessage("nomor plat tidak boleh kosong")
      .bail()
      .isLength({ max: 15 })
      .withMessage("nomor plat tidak boleh melebihi 15 karakter")
      .bail()
      .custom(async (value, { req }) => {
        let mobil = await MobilModel.findOne({
          nomorPlat: value,
          kode: { $ne: req.params.kode },
        });
        if (mobil) {
          return Promise.reject(
            `Mobil dengan nomor ${value} sudah dimiliki mobil lainnya`
          );
        }
      }),
    body("nama")
      .exists()
      .notEmpty()
      .withMessage("Nama wajib ada!")
      .bail()
      .isLength({ min: 3 }),
    body("tarifJam")
      .notEmpty()
      .withMessage("Tarif jam wajib ada")
      .bail()
      .isNumeric()
      .withMessage("Tarif dalam jam wajib ada")
      .bail()
      .toInt()
      .custom(async (value, { req }) => {
        if (value < 40000) {
          return Promise.reject(`${value} harus lebih besar dari ${40000}`);
        }
      }),
    body("tarifHari")
      .notEmpty()
      .bail()
      .isNumeric()
      .withMessage("Tarif hari wajib ada")
      .bail()
      .toInt()
      .custom(async (value, { req }) => {
        console.log(typeof value, value);
        if (value < 90000) {
          return Promise.reject(`${value} harus lebih besar dari ${90000}`);
        }
      }),
    // body("status")
    //   .exists()
    //   .withMessage("status must be available on the body")
    //   .bail()
    //   .isBoolean()
    //   .withMessage("Status must be boolean true or false"),
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
