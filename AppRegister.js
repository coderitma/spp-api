const UserController = require("./controllers/user.controller")

module.exports = (app) => {
  app.use('/v1/user', UserController)
}