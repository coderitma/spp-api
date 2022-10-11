const mongodb = require("../../cores/mongodb");

const MobilModel = mongodb.model(
  "Mobil",
  mongodb.Schema(
    {
      kode: {
        type: String,
        unique: true,
      },
      nomorPlat: {
        type: String,
        unique: true,
      },
      nama: {
        type: String,
        required: true,
      },
      tarifJam: {
        type: Number,
        default: 50000,
      },
      tarifHari: {
        type: Number,
        default: 40000 * 24,
      },
      status: {
        type: Boolean,
        required: true,
        default: true,
      },
    },
    { versionKey: false }
  )
);

module.exports = MobilModel;
