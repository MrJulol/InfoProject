const app = require("express")();
const bodyparser = require("body-parser");
const cors = require("cors");
const mariadb = require("mariadb");

const PORT = 3500;

const pool = mariadb.createPool({
  host: "10.10.31.12",
  user: "root",
  password: "tocorddbroot1234",
  database: "InfoProjekt1",
  connectionLimit: 5,
});

app.use(cors());
app.use(bodyparser.json());

app.get("/", (_, res) => {
  let connection;
  try {
    connection = pool.getConnection();
    console.log("Connected to DB");
  } catch (err) {
    console.error("Error connecting to DB: ", err);
    return res.status(500).send("Error connecting to DB");
  } finally {
    if (connection) {
      connection.release();
    }
  }
  return res.send("<p>Hello</p>");
});

app.listen(PORT, () => {
  console.log("Server started");
});
