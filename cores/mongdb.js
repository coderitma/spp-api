const { config } = require("dotenv");
const mongodb = require("mongoose");

config();
mongodb.connect(process.env.MONGO_URI);

module.exports = (() => mongodb)();
