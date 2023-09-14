const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("./jwt");
const tokenValidateMiddleware = require("./middleware/token");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(tokenValidateMiddleware);

module.exports = app;
