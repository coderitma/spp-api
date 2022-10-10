exports.ValidateMobilBeforeCreate = async (req) => {
  let errorMessage = { message: "" };
  let isValid = true;

  // periksa kode mobil
  if (!req.body.kode) {
    isValid = false;
    errorMessage.kode.push("kode harus tersedia");
  }

  // periksa nama
  if (!req.body.nama) {
    isValid = false;
    errorMessage.message = "Nama mobil harus ada!";
  }

  // periksa tarifJam
  if (!req.body.tarifJam) {
    isValid = false;
    errorMessage.message = "tarif per jam harus ada!";
  }

  // periksa tarifJam tidak boleh dibawah 30000
  if (req.body.tarifJam < 30000) {
    isValid = false;
    errorMessage.message = "tarif per jam tidak boleh dibawah 30000";
  }

  // periksa tarifHari
  if (!req.body.tarifHari) {
    isValid = false;
    errorMessage.message = "tarif per hari harus ada!";
  }

  // periksa tarifHari tidak boleh dibawah 30000
  if (req.body.tarifHari < 30000) {
    isValid = false;
    errorMessage.message = "tarif per hari tidak boleh dibawah 30000";
  }

  // periksa status mobil
  if (!req.body.status) {
    isValid = false;
    errorMessage.message = "Status harus ada!";
  }

  return { errorMessage, isValid };
};
