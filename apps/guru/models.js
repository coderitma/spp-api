const mongodb = require("../../cores/databases/mongodb");

const GuruModel = mongodb.model(
  "Guru",
  mongodb.Schema(
    {
      kode: {
        type: String,
        unique: true,
      },
      nama: {
        type: String,
      },
    },
    { versionKey: false }
  )
);

module.exports = GuruModel;
