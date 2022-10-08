const { Schema } = require("mongoose")
const mongoose = require("../database")

const KelasModel = mongoose.model("Kelas", mongoose.Schema({
  kode: {
    type: String,
    unique: true
  },
  nama: {
    type: String,
    unique: true
  },
  guru: {
    type: String,
    required: true
  }
}))

module.exports = KelasModel