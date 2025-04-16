const mariadb = require("mariadb");

const pool = mariadb.createPool({
  host: "10.10.31.12",
  user: "root",
  password: "tocorddbroot1234",
  database: "InfoProjekt1",
  connectionLimit: 5,
});

module.exports = pool;
