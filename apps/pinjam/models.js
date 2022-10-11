const mongodb = require("../../cores/mongodb");

const MobilModel = mongodb.model(
  "Mobil",
  mongodb.Schema(
    {
      kode: {
        type: String,
        required: true,
      },
      tanggalPinjam: {
        type: Date,
        required: true,
      },
      ktp: {
        type: String,
        required: true,
      },
      namaCustomer: {
        type: String,
        required: true,
      },
      alamat: {
        type: String,
        required: true,
      },
      nomorHP: {
        type: String,
        required: true,
      },
      kartuKeluarga: {
        type: String,
        required: true,
      },
      kodeMobil: {
        type: String,
        required: true,
      },
      totalBiaya: {
        type: Number,
        required: true,
      },
      uangMuka: {
        type: Number,
        required: true,
      },
      sisa: {
        type: Number,
        required: true,
      },
      tanggalBerangkat: {
        type: Date,
        required: true,
      },
      jamBerangkat: {
        type: String,
        required: true,
      },
      statusPinjam: {
        type: String,
        enum: ["booking", "batal", "jalan"],
        default: "booking",
      },
      user: {
        type: String,
        required: true,
      },
    },
    { versionKey: false }
  )
);

module.exports = MobilModel;
