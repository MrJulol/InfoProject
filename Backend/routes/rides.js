var express = require("express");
var router = express.Router();
const pool = require("../services/mariadb");
const authenticate = require("../services/authenticate");

router.get("/open", async (_, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const rows = await connection.query("SELECT * from v_openRides");
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
    const { startPlace, finishPlace, driver, start, seats } = req.body;

    if (!startPlace || !finishPlace || !driver || !start || !seats) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }
    if (seats <= 0) {
      return res.status(400).json({
        error: "Seats must be greater than 0",
      });
    }
    if (new Date(start) < new Date()) {
      return res.status(400).json({
        error: "Start time must be in the future",
      });
    }
    const existingDriver = await connection.query(
      "SELECT * FROM t_user WHERE name = ?",
      [driver]
    );
    if (existingDriver.length === 0) {
      return res.status(400).json({
        error: "Driver not found",
      });
    }
    const driverID = existingDriver[0].id;
    if (existingDriverId !== driver) {
      return res.status(400).json({
        error: "Driver ID does not match",
      });
    }
    const existingRides = await connection.query(
      "SELECT * FROM t_rides WHERE driver = ? AND status = 'open'",
      [driver]
    );
    if (existingRides.length > 0) {
      return res.status(400).json({
        error: "Driver already has an open ride",
      });
    }
    const existingStartPlace = await connection.query(
      "SELECT * FROM t_places WHERE name = ?",
      [startPlace]
    );
    if (existingStartPlace.length === 0) {
      connection.query("INSERT INTO t_places (name) VALUES (?)", [startPlace]);
    }
    const existingFinishPlace = await connection.query(
      "SELECT * FROM t_places WHERE name = ?",
      [finishPlace]
    );
    if (existingFinishPlace.length === 0) {
      connection.query("INSERT INTO t_places (name) VALUES (?)", [finishPlace]);
    }
    const startPlaceId =
      existingStartPlace[0]?.id ||
      (
        await connection.query("SELECT id FROM t_places WHERE name = ?", [
          startPlace,
        ])
      )[0].id;
    const finishPlaceId =
      existingFinishPlace[0]?.id ||
      (
        await connection.query("SELECT id FROM t_places WHERE name = ?", [
          finishPlace,
        ])
      )[0].id;

    const result = await connection.query(
      "INSERT INTO t_rides (status, startPlace, finishPlace, start, driver, seats) VALUES ( ?, ?, ?, ?, ?)",
      ["open", startPlaceId, finishPlaceId, start, driverID, seats]
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

router.put("/reopen", authenticate.authenticateUser, async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { rideId } = req.body;

    if (!rideId) {
      return res.status(400).json({
        error: "Ride ID is required",
      });
    }
    const existingRide = await connection.query(
      "SELECT * FROM t_rides WHERE id = ?",
      [rideId]
    );
    if (existingRide.length === 0) {
      return res.status(404).json({
        error: "Ride not found",
      });
    }
    if (existingRide[0].status !== "archived") {
      return res.status(400).json({
        error: "Ride is not archived",
      });
    }

    const result = await connection.query(
      "UPDATE t_rides SET status = ? WHERE id = ?",
      ["open", rideId]
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

    if (!rideId) {
      return res.status(400).json({
        error: "Ride ID is required",
      });
    }
    const existingRide = await connection.query(
      "SELECT * FROM t_rides WHERE id = ?",
      [rideId]
    );
    if (existingRide.length === 0) {
      return res.status(404).json({
        error: "Ride not found",
      });
    }
    if (existingRide[0].status !== "open") {
      return res.status(400).json({
        error: "Ride is not open",
      });
    }

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
