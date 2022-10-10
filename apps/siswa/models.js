const mongodb = require("../../cores/databases/mongodb");

const SiswaModel = mongodb.model(
  "Siswa",
  mongodb.Schema({
    nis: {
      type: String,
      unique: true,
      required: true,
    },
    nama: {
      type: String,
      required: true,
    },
    kelas: {
      type: String,
      required: true,
    },
    tahunAjaran: {
      type: String,
      required: true,
    },
    biaya: {
      type: Number,
      required: true,
    },
  })
);

module.exports = SiswaModel;
