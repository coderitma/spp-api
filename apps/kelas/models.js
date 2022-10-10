const mongodb = require("../../cores/databases/mongodb");

const KelasModel = mongodb.model(
  "Kelas",
  mongodb.Schema({
    kode: {
      type: String,
      unique: true,
    },
    nama: {
      type: String,
      unique: true,
    },
    guru: {
      type: String,
      required: true,
    },
  })
);

module.exports = KelasModel;
