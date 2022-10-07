const { config } = require("dotenv");
const mongoose = require("mongoose")

config()
mongoose.connect(process.env.MONGO_URI)

module.exports = mongoose