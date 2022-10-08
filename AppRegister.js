const UserController = require("./controllers/user.controller")
const GuruController = require("./controllers/guru.controller")
const KelasController = require("./controllers/kelas.controller")
const SiswaController = require("./controllers/siswa.controller")
const SPPController = require("./controllers/spp.controller")


module.exports = (app) => {
  app.use('/v1/user', UserController)
  app.use('/v1/guru', GuruController)
  app.use('/v1/kelas', KelasController)
  app.use('/v1/siswa', SiswaController)
  app.use('/v1/spp', SPPController)
}