const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("./jwt");
const tokenValidateMiddleware = require("./middleware/token");

const app = express();
app.use([
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  }),
  express.json(),
  cookieParser(),
  tokenValidateMiddleware,
]);
module.exports = app;
