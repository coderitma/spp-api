const mongodb = require("../../cores/databases/mongodb");

const MobilModel = mongodb.model(
  "Mobil",
  mongodb.Schema(
    {
      kode: {
        type: String,
        unique: true,
      },
      nama: {
        type: String,
        required: true,
      },
      tarifJam: {
        type: Number,
        required: true,
        default: 50000,
      },
      tarifHari: {
        type: Number,
        required: true,
        default: 40000 * 24,
      },
    },
    { versionKey: false }
  )
);

module.exports = GuruModel;
