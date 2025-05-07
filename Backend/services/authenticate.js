const jwt = require("jsonwebtoken");

const JWTKey = "WhatTheFluff";

const authenticate = (req, res, next) => {
  const token = req.cookies["token"];
  console.log("Token from cookies:", token);
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  jwt.verify(token, JWTKey, (err, decoded) => {
    if (err) {
      console.error("Token verification error:", err);
      return res.status(401).json({ error: "Unauthorized" });
    }
    req.user = decoded;
    next();
  });
};

const createToken = (user, password) => {
  const token = jwt.sign({ username: user, password: password }, JWTKey, {
    expiresIn: "7days",
  });
  return token;
};

const authenticateToken = (token) => {
  return jwt.verify(token, JWTKey, (err, _) => {
    if (err) {
      console.error("Token verification error:", err);
      return false;
    }
    return true;
  });
};

exports.authenticateUser = authenticate;
exports.createToken = createToken;
exports.authenticateToken = authenticateToken;
