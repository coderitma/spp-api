const mongoose = require("../database")

const GuruModel = mongoose.model("Guru", mongoose.Schema({
    kode: {
      type: String,
      unique: true
    },
    nama: {
      type: String
    }
  },
  { versionKey: false }))

module.exports = GuruModel