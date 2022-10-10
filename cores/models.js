const mongodb = require("./databases/mongodb");

const UserModel = mongodb.model(
  "User",
  mongodb.Schema({
    email: {
      type: String,
      unique: true,
    },
    nama: {
      type: String,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
    },
    isSuperuser: {
      type: Boolean,
      default: false,
    },
    isStaff: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  })
);

module.exports = UserModel;
