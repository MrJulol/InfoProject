var express = require("express");
var router = express.Router();
const pool = require("../services/mariadb");
const authenticate = require("../services/authenticate");

/* GET places listing. */
router.get("/", authenticate.authenticateUser, async (req, res, next) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const rows = await connection.query("SELECT * FROM t_places");

    res.json(rows);
  } catch (err) {
    console.error("Error fetching places:", err);
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

/* Create a new place */
router.post("/add", authenticate.authenticateUser, async (req, res) => {
  let connection;
  try {
    const { name } = req.body;
    connection = await pool.getConnection();
    const result = await connection.query(
      "INSERT INTO t_places (name) VALUES (?)",
      [name]
    );
    res
      .status(201)
      .json({
        message: "Place created successfully",
        id: Number(result.insertId),
      });
  } catch (err) {
    console.error("Error creating place:", err);
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

/* Update a place */
router.put("/update/:id", authenticate.authenticateUser, async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    const { name } = req.body;
    connection = await pool.getConnection();
    await connection.query("UPDATE t_places SET name = ? WHERE id = ?", [
      name,
      id,
    ]);
    res.status(200).json({ message: "Place updated successfully" });
  } catch (err) {
    console.error("Error updating place:", err);
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

/* Delete a place */
router.delete(
  "/delete/:id",
  authenticate.authenticateUser,
  async (req, res) => {
    let connection;
    try {
      const { id } = req.params;
      connection = await pool.getConnection();
      await connection.query("DELETE FROM t_places WHERE id = ?", [id]);
      res.status(200).json({ message: "Place deleted successfully" });
    } catch (err) {
      console.error("Error deleting place:", err);
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
  }
);

/* Get a place by ID */
router.get("/:id", authenticate.authenticateUser, async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    connection = await pool.getConnection();
    const rows = await connection.query("SELECT * FROM t_places WHERE id = ?", [
      id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Place not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching place:", err);
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

/* Get places by name */
router.get("/search/:name", authenticate.authenticateUser, async (req, res) => {
  let connection;
  try {
    const { name } = req.params;
    connection = await pool.getConnection();
    const rows = await connection.query(
      "SELECT * FROM t_places WHERE name LIKE ?",
      [`%${name}%`]
    );
    res.json(rows);
  } catch (err) {
    console.error("Error searching places:", err);
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
