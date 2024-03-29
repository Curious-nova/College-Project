const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const salt = 10;
dotenv.config();

const app = express();
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.json());

//DB connection

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "travel_booking_system",
  authPlugin: "mysql_native_password",
});

db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("DB connected successfully");
  }
});

//controllers

app.post("/register", (req, res) => {
  bcrypt.hash(req.body.password.toString(), salt, (err, hashedPassword) => {
    if (err) {
      console.log(err);
      return res.json({ Error: "Failed to hash" });
    }

    const sql =
      "INSERT INTO register (`username`, `email`, `password`) VALUES (?, ?, ?)";
    const values = [req.body.username, req.body.email, hashedPassword];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.log(err);
        return res.json({ Error: "Failed to Register" });
      } else {
        return res.json({ status: "success" });
      }
    });
  });
});

app.post("/login", (req, res) => {
  const sql = "SELECT * FROM register where email=?";
  db.query(sql, req.body.email, (err, data) => {
    if (err) {
      return res.json({ Error: "Failed to login" });
    } else if (data.length > 0) {
      bcrypt.compare(
        req.body.password.toString(),
        data[0].password,
        (err, result) => {
          if (err) {
            return res.json({ Error: "Internal Error" });
          }
          if (result) {
            // Check 'result' instead of 'res'
            const username = data[0].username;
            const token = jwt.sign({ username }, process.env.SECRET_KEY, {
              expiresIn: "1d",
            });
            res.cookie("token", token);
            console.log(token);
            return res.json({ status: "success" });
          } else {
            return res.json({ Error: "Bad Credentials" });
          }
        }
      );
    } else {
      return res.json({ Error: "No user found" });
    }
  });
});

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ Error: "Not authenticated" });
  } else {
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.json({ Error: "Failed to authenticate" });
      } else {
        req.username = decoded.username;
        next();
      }
    });
  }
};
app.get("/", verifyUser, (req, res) => {
  return res.json({ status: "success", name: req.username });
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ status: "success" });
});
app.listen(
  process.env.PORT || 8080,
  console.log(`server running on port ${process.env.PORT}`)
);
