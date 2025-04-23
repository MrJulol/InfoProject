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

router.post("/create", authenticate.authenticateUser, async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { startPlace, finishPlace, driver } = req.body;

    const existingRides = await connection.query(
      "SELECT * FROM t_rides WHERE driver = ? AND status = 'open'",
      [driver]
    );
    if (existingRides.length > 0) {
      return res.status(400).json({
        error: "Driver already has an open ride",
      });
    }

    const result = await connection.query(
      "INSERT INTO t_rides (status, startPlace, finishPlace, start, driver) VALUES ( ?, ?, ?, ?, ?)",
      ["open", startPlace, finishPlace, new Date(), driver]
    );

    res.status(201).json({
      message: "Ride created successfully",
      rideId: Number(result.insertId),
    });
  } catch (err) {
    console.error("Error creating ride:", err);
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

router.put("/update", authenticate.authenticateUser, async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { rideId, status } = req.body;

    const result = await connection.query(
      "UPDATE t_rides SET status = ? WHERE id = ?",
      [status, rideId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Ride not found" });
    }

    res.json({ message: "Ride updated successfully" });
  } catch (err) {
    console.error("Error updating ride:", err);
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

router.post("/finish", authenticate.authenticateUser, async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { rideId } = req.body;

    const result = await connection.query(
      "UPDATE t_rides SET status = ?, end = ? WHERE ID = ?",
      ["archived", new Date(), rideId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Ride not found" });
    }

    res.json({ message: "Ride finished successfully" });
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
