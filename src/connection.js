const mysql = require("mysql");
const dbConfig = require("./config/db.js");

const connection = mysql.createConnection(dbConfig);

module.exports = connection;
