var express = require("express");
var router = express.Router();
const pool = require("../services/mariadb");
const authenticate = require("../services/authenticate");

/* GET users listing. */
router.get("/", authenticate.authenticateUser, async (req, res, next) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const rows = await connection.query("SELECT * FROM t_user");

    res.json(rows);
  } catch (err) {
    console.error("Error fetching users:", err);
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

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    const rows = await connection.query(
      "SELECT name FROM t_user WHERE name = ? AND password = ?",
      [username, password]
    );

    if (rows.length > 0) {
      let token = undefined;
      // Check if the token is already set
      if (
        req.cookies["token"] &&
        authenticate.authenticateToken(req.cookies["token"])
      ) {
        token = req.cookies["token"];
      } else {
        token = authenticate.createToken(rows[0].name, password);
      }
      // Set the token in the cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Set to true if using HTTPS
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      res.json({ message: "Login successful", token: token });
    } else {
      res.status(401).json({ error: "Invalid username or password" });
    }
  } catch (err) {
    console.error("Error during login:", err);
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

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    const result = await connection.query(
      "INSERT INTO t_user (name, password) VALUES (?, ?)",
      [username, password]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error during registration:", err);
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

router.post("/logout", authenticate.authenticateUser, (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Set to true if using HTTPS
  });
  res.json({ message: "Logout successful" });
});

router.get("/check", authenticate.authenticateUser, (req, res) => {
  // Check if the user is authenticated
  if (req.user) {
    res.json({ message: "User is authenticated", user: req.user });
  } else {
    res.status(401).json({ error: "User is not authenticated" });
  }
});

router.get("/checkToken", (req, res) => {
  // Check if the token is valid
  if (
    req.cookies["token"] &&
    authenticate.authenticateToken(req.cookies["token"])
  ) {
    res.json({ message: "Token is valid" });
  } else {
    res.status(401).json({ error: "Token is invalid" });
  }
});

module.exports = router;
