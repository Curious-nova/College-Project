const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const ejs = require('ejs');
const htmlToPdf = require('html-pdf');

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

//DB connection

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "ash1006@",
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

// PDF Generator function
async function generateFlightTicketPDF(ticketData) {
  try {
    // Compile EJS template
    const templatePath = 'flight_ticket_template.ejs';
    const html = await ejs.renderFile(templatePath, { ticketData });

    // Options for PDF generation
    const options = {
      format: 'Letter',
      border: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
      }
    };

    // Generate PDF from HTML
    const pdfPath = 'flight_ticket.pdf';
    await new Promise((resolve, reject) => {
      htmlToPdf.create(html, options).toFile(pdfPath, (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });

    return pdfPath;
  } catch (error) {
    console.error('Error generating flight ticket PDF:', error);
    throw new Error('Failed to generate flight ticket PDF');
  }
}

// Flight Ticket Generator function
const generateAndDownloadTicket = async (userId) => {
  try {
    // Query database to retrieve flight and traveler data
    const flightDataQuery =
      "SELECT * FROM booked_flights WHERE register_id = ?";
    const travelerDataQuery = "SELECT * FROM travellers WHERE register_id = ?";
    const [flightData, travelerData] = await Promise.all([
      queryPromise(flightDataQuery, [userId]),
      queryPromise(travelerDataQuery, [userId]),
    ]);

    // Format data for PDF generation
    const ticketData = {
      flight: flightData[0], // Assuming there's only one flight associated with the register_id
      travelers: travelerData,
    };

    // Generate PDF
    const pdfPath = await generateFlightTicketPDF(ticketData);

    return pdfPath;
  } catch (error) {
    console.error("Error generating flight ticket PDF:", error);
    throw new Error("Failed to generate flight ticket PDF");
  }
};

// Utility function for executing database queries
const queryPromise = (sql, values) => {
  return new Promise((resolve, reject) => {
    db.query(sql, values, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

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
  db.query(sql, [req.body.email], (err, data) => {
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
            const username = data[0].username;
            const token = jwt.sign({ username }, process.env.SECRET_KEY, {
              expiresIn: "1d",
            });
            res.cookie("token", token);
            console.log(token);
            return res.json({ status: "success", userId: data[0].id }); // Add userId to the response
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
  const username = req.username;
  const sql = "SELECT * FROM register WHERE username = ?";
  db.query(sql, [username], (err, data) => {
    if (err) {
      console.error("Error fetching user details:", err);
      return res.status(500).json({ error: "Failed to fetch user details" });
    }
    if (data.length > 0) {
      const userDetails = {
        id: data[0].id,
        name: data[0].username,
        email: data[0].email,
      };
      return res.json({ status: "success", ...userDetails });
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  });
});

app.get("/getuserdetails", (req, res) => {
  const userId = req.query.id; // Assuming the frontend will pass user ID as a query parameter

  const sql = "SELECT username, email FROM register WHERE id = ?";
  db.query(sql, [userId], (err, data) => {
    if (err) {
      console.error("Error fetching user details:", err);
      return res.status(500).json({ error: "Failed to fetch user details" });
    }
    if (data.length > 0) {
      const userDetails = {
        name: data[0].username,
        email: data[0].email,
      };
      return res.json({ status: "success", ...userDetails });
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  });
});

// Route to store third-party booking details
app.post("/add-booking", (req, res) => {
  const bookingData = req.body;

  // Extract booking data from the request body
  const {
    register_id,
    booking_date,
    departure_city,
    arrival_city,
    departure_datetime,
    arrival_datetime,
    num_travelers,
    booking_company,
    booking_type,
    total_price,
    additional_info,
  } = bookingData;

  // Prepare SQL query
  const sql =
    "INSERT INTO third_party_bookings (register_id, booking_date, departure_city, arrival_city, departure_datetime, arrival_datetime, num_travelers, booking_company, booking_type, total_price, additional_info) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const values = [
    register_id,
    booking_date,
    departure_city,
    arrival_city,
    departure_datetime,
    arrival_datetime,
    num_travelers,
    booking_company,
    booking_type,
    total_price,
    additional_info,
  ];

  // Insert booking data into the database
  db.query(sql, values, (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ Error: "Failed to store booking details" });
    } else {
      return res.json({ status: "success" });
    }
  });
});

// Route to fetch third-party booking details by user id
app.get("/third-party-bookings/:userId", (req, res) => {
  const userId = req.params.userId;
  const sql = "SELECT * FROM third_party_bookings WHERE register_id = ?";
  db.query(sql, [userId], (err, data) => {
    if (err) {
      console.error("Error fetching third-party booking details:", err);
      return res
        .status(500)
        .json({ error: "Failed to fetch third-party booking details" });
    } else {
      return res.json(data);
    }
  });
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ status: "success" });
});

// Route to store flight details
app.post("/storeFlightDetails", (req, res) => {
  const flightData = req.body;
  const travelerData = flightData.travelers; // Get travelers array from request body
  const num_travelers = travelerData.length; // Number of travelers
  const price = flightData.priceBreakdown.total.units; // Assuming price in INR
  const total_price = price * num_travelers; // Calculate total price

  const arrival = flightData.segments[0].arrivalAirport.name;
  const arrival_city = flightData.segments[0].arrivalAirport.cityName;
  const arrival_time = flightData.segments[0].arrivalTime;
  const departure = flightData.segments[0].departureAirport.name;
  const departure_city = flightData.segments[0].departureAirport.cityName;
  const departure_time = flightData.segments[0].departureTime;
  const airline = flightData.segments[0].legs[0].carriersData[0].name; // Assuming the first carrier as the airline
  const register_id = flightData.user_id;
  const sql =
    "INSERT INTO booked_flights (register_id, arrival, arrival_city, arrival_time, departure, departure_city, departure_time, airline, price, num_travelers, total_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const values = [
    register_id,
    arrival,
    arrival_city,
    arrival_time,
    departure,
    departure_city,
    departure_time,
    airline,
    price,
    num_travelers,
    total_price,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ Error: "Failed to store flight details" });
    } else {
      return res.json({ status: "success" });
    }
  });
});

// Route to store traveler details
app.post("/storeTravelerDetails", (req, res) => {
  const travelers = req.body.travelers;

  // Prepare SQL query
  const sql =
    "INSERT INTO travellers (register_id, name, age, gender) VALUES (?, ?, ?, ?)";

  // Insert each traveler into the database
  travelers.forEach((traveler) => {
    const { user_id, name, age, gender } = traveler;
    const values = [user_id, name, age, gender];
    db.query(sql, values, (err, result) => {
      if (err) {
        console.log(err);
        return res.json({ Error: "Failed to store traveler details" });
      }
    });
  });

  return res.json({ status: "success" });
});

// Route to fetch booking flight details by user id
app.get("/booking-flights/:userId", (req, res) => {
  const userId = req.params.userId;
  const sql = "SELECT * FROM booked_flights WHERE register_id = ?";
  db.query(sql, [userId], (err, data) => {
    if (err) {
      console.error("Error fetching booking flight details:", err);
      return res
        .status(500)
        .json({ error: "Failed to fetch booking flight details" });
    } else {
      return res.json(data);
    }
  });
});

const path = require("path");

// Route to generate and download flight ticket PDF
app.get("/generate-and-download-ticket/:userId", (req, res) => {
  const userId = req.params.userId;
  generateAndDownloadTicket(userId)
    .then((pdfPath) => {
      const fileName = "flight_ticket.pdf"; // File name for the downloaded PDF

      // Read the file contents
      fs.readFile(pdfPath, (err, data) => {
        if (err) {
          console.error("Error reading flight ticket PDF:", err);
          res.status(500).json({ error: "Failed to read flight ticket PDF" });
        } else {
          // Set headers to force browser to download the file as an attachment
          res.setHeader(
            "Content-Disposition",
            `attachment; filename="${fileName}"`
          );
          res.setHeader("Content-Type", "application/pdf");

          // Send the file data as a response
          res.send(data);

          // Delete the generated PDF file after sending
          fs.unlinkSync(pdfPath);
        }
      });
    })
    .catch((error) => {
      console.error("Error generating flight ticket PDF:", error);
      res.status(500).json({ error: "Failed to generate flight ticket PDF" });
    });
});

app.listen(
  process.env.PORT || 8080,
  console.log(`server running on port ${process.env.PORT || 8080}`)
);
