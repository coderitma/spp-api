const { config } = require("dotenv");
const mongodb = require("mongoose");

config();

module.exports = (() => {
  mongodb.connect(process.env.MONGO_URI);
  return mongodb;
})();
