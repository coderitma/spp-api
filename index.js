const { config } = require("dotenv");
let express = require("express");
const bodyParser = require("body-parser");
var cors = require("cors");
const app = express();
const AppRegister = require("./AppRegister");

config();

app.use(cors());
app.use(bodyParser.json());

AppRegister(app);

const PORT = 3001;

app.listen(PORT);
