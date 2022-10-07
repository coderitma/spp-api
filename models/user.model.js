const mongoose = require("../database")

const UserModel = mongoose.model("User", mongoose.Schema({
  email: {
    type: String,
    unique: true
  },
  nama: {
    type: String
  },
  salt: {
    type: String
  },
  password: {
    type: String,
  },
  isSuperuser: {
    type: Boolean,
    default: false
  },
  isStaff: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: false
  }
}));

module.exports = UserModel

// exports.createUser = async (email, nama, password) => {
//   const passwordSalt = makePassword(password);
//   const newUser = new UserSchema({
//     email, nama,
//     ...passwordSalt, isActive: true
//   });

//   await newUser.save();
//   return { email, nama }
// }


// exports.get = async (email, exclude) => {
//   const user = await UserSchema.findOne({email});
//   return user;
// }
