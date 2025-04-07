// server.js
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); // To parse JSON bodies

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Iamnerd98#", // change this to your MySQL password
  database: "sampledb", // change this to your database
});

db.connect((err) => {
  if (err) {
    console.error("DB connection failed:", err);
    return;
  }
  console.log("Connected to MySQL");
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }
  db.query(
    "SELECT * FROM Users WHERE username = ?",
    [username],
    (err, results) => {
      if (err) return res.status(500).json(err);
      if (results.length === 0) {
        res.status(401).json({ error: "User does not exist, please signup!" });
      }
    }
  );

  db.query(
    "SELECT * FROM Users WHERE username = ? AND password = ?",
    [username, password],
    (err, results) => {
      if (err) return res.status(500).json(err);
      if (results.length > 0) {
        res.json({ success: true });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    }
  );
});

app.post("/api/signup", (req, res) => {
  const { username, password, confirmPassword } = req.body;
  if (!username || !password || !confirmPassword) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  db.query(
    "SELECT * FROM Users WHERE username = ?",
    [username],
    (err, results) => {
      if (err) return res.status(500).json(err);
      if (results.length > 0) {
        return res.status(400).json({ error: "Username already exists" });
      }
    }
  );

  db.query(
    "INSERT INTO Users (username, password) VALUES (?, ?)",
    [username, password],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json({ success: true });
    }
  );
});

app.get("/api/students", async (req, res) => {
  db.query("SELECT * FROM Students", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.post("/api/addstudents", (req, res) => {
  try {
    const { Name, Grade, BusRouteID, BoardingPoint } = req.body;
    console.log(Name, Grade, BusRouteID, BoardingPoint);

    if (!Name || !Grade || !BusRouteID || !BoardingPoint) {
      return res.status(400).json({ error: "All fields are required" });
    }

    db.query(
      "SELECT * FROM Students WHERE Name = ?",
      [Name],
      (err, results) => {
        if (err) return res.status(500).json(err);

        if (results.length > 0) {
          return res.status(400).json({ error: "Student already exists" });
        }

        db.query(
          "INSERT INTO Students(Name, Grade, BusRouteId, BoardingPoint) VALUES (?, ?, ?, ?)",
          [Name, Grade, BusRouteID, BoardingPoint],
          (err, insertResults) => {
            if (err) return res.status(500).json(err);
            res.json({ success: true });
          }
        );
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.get("/api/routes", (req, res) => {
  db.query("SELECT * FROM Routes", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.get("/api/buses", (req, res) => {
  db.query("SELECT * FROM Buses", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.get("/api/drivers", (req, res) => {
  db.query("SELECT * FROM Drivers", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.get("/api/maintenance", (req, res) => {
  db.query("SELECT * FROM MaintenanceLogs", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.get("/api/incidents", (req, res) => {
  db.query("SELECT * FROM Incidents", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
