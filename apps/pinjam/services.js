const MobilModel = require("../mobil/models");

exports.calculatePinjamBeforeCreate = async (req) => {
  let mobil = await MobilModel.findOne({ kode: req.body.kodeMobil });
  req.body.tarifJam = mobil.tarifJam;
  req.body.tarifHari = mobil.tarifHari;
  req.body.namaMobil = mobil.nama;

  let harga = mobil.tarifJam;

  if (req.body.durasi === "hari") {
    harga = mobil.tarifHari;
  }

  req.body.totalBiaya = req.body.lamaPinjam * harga;
  if (req.body.uangMuka > req.body.totalBiaya) {
    req.body.sisa = req.body.uangMuka - req.body.totalBiaya;
  } else {
    req.body.sisa = req.body.totalBiaya - req.body.uangMuka;
  }
};

exports.calculatePinjamAfterCreate = async (req) => {
  await MobilModel.findOneAndUpdate(
    { kode: req.body.kodeMobil },
    { status: false }
  );
};

exports.calculatePinjamBeforeUpdate = async (req) => {
  await this.calculatePinjamBeforeCreate(req);
};
