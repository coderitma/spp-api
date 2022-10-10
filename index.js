const { config } = require("dotenv");
let express = require("express");
const bodyParser = require("body-parser");
var cors = require("cors");
const main = require("./cores/main");
const app = express();

config();

app.use(cors());
app.use(bodyParser.json());

main(app);

const PORT = 3001;

app.listen(PORT);
