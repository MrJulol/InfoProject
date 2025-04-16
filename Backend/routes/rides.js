var express = require("express");
var router = express.Router();
const pool = require("../services/mariadb");
const authenticate = require("../services/authenticate");

/* GET rides listing. */
router.get("/", authenticate.authenticateUser, async (req, res, next) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const rows = await connection.query("SELECT * FROM t_rides");

    res.json(rows);
  } catch (err) {
    console.error("Error fetching rides:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (connection) {
      try {
        await connection.release();
      } catch (err) {
        console.error("Error releasing connection:", err);
      }
    }
  }
});

router.get("/open", authenticate.authenticateUser, async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const rows = await connection.query(
      "SELECT * FROM t_rides WHERE status = 'open'"
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching open rides:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (connection) {
      try {
        await connection.release();
      } catch (err) {
        console.error("Error releasing connection:", err);
      }
    }
  }
});

router.get("/archive", authenticate.authenticateUser, async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const rows = await connection.query(
      "SELECT * FROM t_rides WHERE status = 'archived'"
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching archived rides:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (connection) {
      try {
        await connection.release();
      } catch (err) {
        console.error("Error releasing connection:", err);
      }
    }
  }
});

router.post("/create", authenticate.authenticateUser, async (req, res) => {});

router.post("/update", authenticate.authenticateUser, async (req, res) => {});

router.post("/delete", authenticate.authenticateUser, async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { rideId } = req.body;

    const result = await connection.query("DELETE FROM t_rides WHERE id = ?", [
      rideId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Ride not found" });
    }

    res.json({ message: "Ride deleted successfully" });
  } catch (err) {
    console.error("Error deleting ride:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (connection) {
      try {
        await connection.release();
      } catch (err) {
        console.error("Error releasing connection:", err);
      }
    }
  }
});

module.exports = router;
