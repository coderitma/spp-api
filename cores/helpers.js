var jwt = require("jsonwebtoken");
var crypto = require("crypto");

/**
 * Method yang ada async meskipun tidak ada await
 * di dalam isinya, saat dipanggil harus menggunakan await!
 * Untuk berjaga-jaga saja, buat semua async meskipun di dalamnya
 * tidak ada await. Saat memanggil method tersebut, harus wajib pake
 * await.
 */

exports.makePassword = async (password, salt = null) => {
  if (!salt) {
    salt = crypto.randomBytes(16).toString("hex");
  }

  password = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");

  return { salt, password };
};

exports.authenticated = async (
  userModel,
  password,
  uniqueIdentifier = "email"
) => {
  const user = await userModel.findOne({
    [uniqueIdentifier]: req.body[uniqueIdentifier],
  });

  if (!user) {
    return null;
  }

  const { password } = await this.makePassword(password, user.salt);

  if (password === user.password) {
    return {
      email: user.email,
      nama: user.nama,
      isActive: user.isActive,
    };
  }

  return null;
};

exports.makeToken = async (user) => {
  return jwt.sign(user, process.env.PROJECT_KEY, { expiresIn: "10000s" });
};

exports.generateCounterID = async (schema, prefix, stop = 12) => {
  const date = new Date();
  const month = String(date.getMonth()).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  let count = await schema.countDocuments();
  let result = [];
  for (let index = 1; index <= stop; index++) {
    count += index;
    let nomor = `${prefix.toUpperCase()}-${String(count).padStart(
      4,
      "0"
    )}-${month}${year}${hours}${minutes}${seconds}`;
    result.push(nomor);
  }
  return result;
};

exports.generateID = async (schema, prefix) => {};

exports.getMonthName = async (monthNumber) => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return monthNames[monthNumber];
};
