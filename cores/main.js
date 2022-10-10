const GuruController = require("../apps/guru/controllers");
const KelasController = require("../apps/kelas/controllers");
const MobilController = require("../apps/mobil/controllers");
const SiswaController = require("../apps/siswa/controllers");
const SPPController = require("../apps/spp/controllers");
const UserController = require("./controllers");

module.exports = (app) => {
  app.use("/v1/user", UserController);
  app.use("/v1/guru", GuruController);
  app.use("/v1/kelas", KelasController);
  app.use("/v1/siswa", SiswaController);
  app.use("/v1/spp", SPPController);
  app.use("/v1/mobil", MobilController);
};
