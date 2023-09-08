const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: (origin, callback) => {
      const whiteList = ["http://localhost:8080"];

      if (whiteList.indexOf(origin) === -1) {
        callback(new Error("Not Allowed origin"));

        return;
      }

      callback(null, true);
    },
  })
);

module.exports = app;
