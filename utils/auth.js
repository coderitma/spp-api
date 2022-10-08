var jwt = require("jsonwebtoken");
var crypto = require("crypto");
const UserModel = require("../models/user.model");

/**
 * Method yang ada async meskipun tidak ada await
 * di dalam isinya, saat dipanggil harus menggunakan await!
 * Untuk berjaga-jaga saja, buat semua async meskipun di dalamnya 
 * tidak ada await. Saat memanggil method tersebut, harus wajib pake
 * await.
 */

exports.makePassword = async (password, salt=null) => {
  if (!salt) {
    salt = crypto.randomBytes(16).toString("hex");
  }

  password = crypto.pbkdf2Sync(
    password, salt, 1000, 64, 'sha512'
  ).toString('hex');

  return { salt, password }
}

exports.authenticated = async (req) => {
  const user = await UserModel.findOne({email: req.body.email});
  
  if (!user) {
    return null
  }

  const { password } = await this.makePassword(req.body.password, user.salt)

  if (password === user.password) {
    return {
      email: user.email,
      nama: user.nama,
      isActive: user.isActive
    }
  }

  return null
}


exports.makeToken = async (user) => {
  return jwt.sign(user, process.env.PROJECT_KEY, { expiresIn: '10000s' })
}