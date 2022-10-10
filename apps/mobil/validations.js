exports.ValidateMobilBeforeCreate = async (req) => {
  let messages = {};
  let isValid = true;

  // periksa kode mobil
  if (!req.body.kode) {
    isValid = false;
    messages.kode = "kode harus tersedia";
  }

  // periksa nama
  if (!req.body.nama) {
    isValid = false;
    messages.nama = "Nama mobil harus ada!";
  }

  // periksa tarifJam
  if (!req.body.tarifJam) {
    isValid = false;
    messages.tarifJam = "tarif per jam harus ada!";
  }

  // periksa tarifJam tidak boleh dibawah 30000
  if (req.body.tarifJam < 30000) {
    isValid = false;
    messages.tarifJam = "tarif per jam tidak dibawah 30000";
  }

  // periksa tarifHari
  if (!req.body.tarifHari) {
    isValid = false;
    messages.tarifHari = "tarif per hari harus ada!";
  }

  // periksa tarifHari tidak boleh dibawah 30000
  if (req.body.tarifHari < 30000) {
    isValid = false;
    messages.tarifHari = "tarif per hari tidak dibawah 30000";
  }

  // periksa status mobil
  if (!req.body.status) {
    isValid = false;
    messages.status = "status harus tersedia";
  }

  return { messages, isValid };
};
