const mongodb = require("../../cores/mongodb");

const SPPModel = mongodb.model(
  "SPP",
  mongodb.Schema({
    nomor: {
      type: String,
      unique: true,
    },
    jatuhTempo: {
      type: Date,
    },
    bulan: {
      type: String,
    },
    biaya: {
      type: Number,
    },
    tanggalBayar: {
      type: Date,
      default: null,
    },
    jumlah: {
      type: Number,
      default: 0,
    },
    status: {
      type: Boolean,
      default: false,
    },
    tahunAjaran: {
      type: String,
    },
    nis: {
      type: String,
      required: true,
    },
    namaSiswa: {
      type: String,
      required: true,
    },
    kodeKelas: {
      type: String,
      required: true,
    },
    namaKelas: {
      type: String,
      required: true,
    },
    keterangan: {
      type: String,
      enum: ["Pembayaran Lunas", "Melunasi Tunggakan", ""],
      default: "",
    },
    user: {
      type: String,
      required: true,
    },
  })
);

module.exports = SPPModel;
