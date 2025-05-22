var express = require("express");
var router = express.Router();
const pool = require("../services/mariadb");
const authenticate = require("../services/authenticate");

router.post("/book", async (req, res) => {
  console.log("Booking ride");

  const { rideId, userName } = req.body;

  console.log("Ride ID:", rideId);
  console.log("User Name:", userName);

  let connection;
  try {
    connection = await pool.getConnection();
    const [ride] = await connection.query(
      "SELECT * FROM t_rides WHERE id = ?",
      [rideId]
    );
    if (!ride) {
      return res.status(404).json({ error: "Ride not found" });
    }
    const user = await connection.query(
      "SELECT ID FROM t_user WHERE name = ?",
      [userName]
    );
    if (user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const userId = user[0].ID;

    if (!ride) {
      return res.status(404).json({ error: "Ride not found" });
    }

    if (ride.status !== "open") {
      return res
        .status(400)
        .json({ error: "Ride is not available for booking" });
    }

    const result = await connection.query(
      "INSERT INTO t_booking (user_id, ride_id) VALUES (?, ?)",
      [userId, rideId]
    );

    res.json({
      message: "Ride booked successfully",
      bookingId: Number(result.insertId),
    });
  } catch (err) {
    console.error("Error booking ride:", err);
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
router.post("/cancel", authenticate.authenticateUser, async (req, res) => {
  const { rideId, userName } = req.body;
  let connection;
  try {
    connection = await pool.getConnection();

    const user = await connection.query(
      "SELECT ID FROM t_user WHERE name = ?",
      [userName]
    );
    if (user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const userId = user[0].ID;

    const ride = await connection.query("SELECT * FROM t_rides WHERE id = ?", [
      rideId,
    ]);
    if (!ride) {
      return res.status(404).json({ error: "Ride not found" });
    }
    const booking = await connection.query(
      "SELECT * FROM t_booking WHERE ride_id = ? AND user_id = ?",
      [rideId, userId]
    );
    if (booking.length === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const result = await connection.query(
      "DELETE FROM t_booking WHERE ride_id = ? AND user_id = ?",
      [rideId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json({ message: "Booking cancelled successfully" });
  } catch (err) {
    console.error("Error cancelling booking:", err);
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
router.get("/userBookings", authenticate.authenticateUser, async (req, res) => {
  const { userName } = req.query;
  console.log("User Name:", userName);
  let connection;
  try {
    connection = await pool.getConnection();

    const user = await connection.query(
      "SELECT ID FROM t_user WHERE name = ?",
      [userName]
    );
    if (user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const userId = user[0].ID;

    const bookings = await connection.query("SELECT * FROM v_userRides", [
      userId,
    ]);

    res.json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
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
router.get("/rideBookings", authenticate.authenticateUser, async (req, res) => {
  const { rideId } = req.query;
  let connection;
  try {
    connection = await pool.getConnection();
    const bookings = await connection.query(
      "SELECT * FROM t_booking WHERE ride_id = ?",
      [rideId]
    );

    res.json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
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
