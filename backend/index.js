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
const nodemailer = require("nodemailer");
const cron = require('node-cron');


const salt = 10;
dotenv.config();

const app = express();
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
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
const generateAndDownloadTicket = async (userId, ticketId) => {
  try {
    // Query database to retrieve flight and traveler data
    const flightDataQuery =
      "SELECT * FROM booked_flights WHERE register_id = ? AND ticket_id = ?";
    const travelerDataQuery = "SELECT * FROM travellers WHERE register_id = ? AND ticket_id = ?";
    const [flightData, travelerData] = await Promise.all([
      queryPromise(flightDataQuery, [userId, ticketId]),
      queryPromise(travelerDataQuery, [userId, ticketId]),
    ]);

    // Format data for PDF generation
    const ticketData = {
      ticketId: ticketId,
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

// Setup nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


app.post("/send-otp", (req, res) => {
  const email = req.body.email;
  const checkEmailQuery = "SELECT email FROM register WHERE email = ?";

  db.query(checkEmailQuery, [email], (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ Error: "Database error" });
    } 
    if (result.length > 0) {
      return res.json({ Error: "Email already registered. Please login." });
    } 

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in the database
    const storeOtpQuery = "INSERT INTO otp_store (email, otp) VALUES (?, ?)";
    db.query(storeOtpQuery, [email, otp], (err, result) => {
      if (err) {
        console.log(err);
        return res.json({ Error: "Database error" });
      }

      // Send OTP email
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd;">
            <div style="text-align: center;">
              <img src="https://i.imgur.com/CUfYqLm.jpeg" alt="BookMyTrip Logo" style="max-width: 100px; margin-bottom: 20px;">
            </div>
            <h2 style="text-align: center; color: #333;">Verify your email address</h2>
            <p>You need to verify your email address to continue using your account. Enter the following code to verify your email address:</p>
            <h1 style="text-align: center; color: #333;">${otp}</h1>
            <p style="text-align: center; color: #777;">This OTP is valid for 5 minutes.</p>
            <hr>
            <p style="color: #777; font-size: 12px; text-align: center;">
              If you did not request this code, please ignore this email.
            </p>
          </div>
        `,
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log(err);
          return res.json({ Error: "Failed to send OTP" });
        } else {
          console.log('Email sent: ' + info.response);
          return res.json({ status: "success" });
        }
      });
    });
  });
});


app.post("/verify-otp", (req, res) => {
  const { email, username, password, otp } = req.body;

  // Check OTP in the database
  const checkOtpQuery = "SELECT otp, created_at FROM otp_store WHERE email = ? ORDER BY created_at DESC LIMIT 1";
  db.query(checkOtpQuery, [email], (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ Error: "Database error" });
    }
    if (result.length === 0 || result[0].otp !== otp) {
      return res.json({ Error: "Invalid OTP" });
    }

    // Check if OTP is expired
    const otpTimestamp = new Date(result[0].created_at);
    const currentTime = new Date();
    const timeDifference = Math.floor((currentTime - otpTimestamp) / 1000); // in seconds

    if (timeDifference > 300) { // 5 minutes = 300 seconds
      return res.json({ Error: "OTP expired" });
    }

    bcrypt.hash(password.toString(), salt, (err, hashedPassword) => {
      if (err) {
        console.log(err);
        return res.json({ Error: "Failed to hash password" });
      }

      const sql = "INSERT INTO register (`username`, `email`, `password`) VALUES (?, ?, ?)";
      const values = [username, email, hashedPassword];

      db.query(sql, values, (err, result) => {
        if (err) {
          console.log(err);
          return res.json({ Error: "Failed to register" });
        } else {
          // Remove OTP from store
          const deleteOtpQuery = "DELETE FROM otp_store WHERE email = ?";
          db.query(deleteOtpQuery, [email], (err, result) => {
            if (err) {
              console.log(err);
            }
          });
          return res.json({ status: "success" });
        }
      });
    });
  });
});


app.post("/resend-otp", (req, res) => {
  const email = req.body.email;
  const checkEmailQuery = "SELECT email FROM otp_store WHERE email = ?";

  db.query(checkEmailQuery, [email], (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ Error: "Database error" });
    }
    if (result.length === 0) {
      return res.json({ Error: "Session Timed Out! Please Register Again." });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Update OTP and created_at in the database
    const updateOtpQuery = "UPDATE otp_store SET otp = ?, created_at = NOW() WHERE email = ?";
    db.query(updateOtpQuery, [otp, email], (err, result) => {
      if (err) {
        console.log(err);
        return res.json({ Error: "Database error" });
      }

      // Send OTP email
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your New OTP Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd;">
            <div style="text-align: center;">
              <img src="https://i.imgur.com/CUfYqLm.jpeg" alt="BookMyTrip Logo" style="max-width: 100px; margin-bottom: 20px;">
            </div>
            <h2 style="text-align: center; color: #333;">Verify your email address</h2>
            <p>You need to verify your email address to continue using your account. Enter the following code to verify your email address:</p>
            <h1 style="text-align: center; color: #333;">${otp}</h1>
            <p style="text-align: center; color: #777;">This OTP is valid for 5 minutes.</p>
            <hr>
            <p style="color: #777; font-size: 12px; text-align: center;">
              If you did not request this code, please ignore this email.
            </p>
          </div>
        `,
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log(err);
          return res.json({ Error: "Failed to send OTP" });
        } else {
          console.log('Email sent: ' + info.response);
          return res.json({ status: "success" });
        }
      });
    });
  });
});



const deleteExpiredOtps = () => {
  const deleteExpiredOtpQuery = "DELETE FROM otp_store WHERE created_at < NOW() - INTERVAL 5 MINUTE";
  db.query(deleteExpiredOtpQuery, (err, result) => {
    if (err) {
      console.log("Error deleting expired OTPs:", err);
    } else {
      console.log("Expired OTPs cleaned up");

      // Check if there are any remaining expired OTPs
      const checkRemainingOtpsQuery = "SELECT COUNT(*) AS count FROM otp_store WHERE created_at < NOW() - INTERVAL 5 MINUTE";
      db.query(checkRemainingOtpsQuery, (err, result) => {
        if (err) {
          console.log("Error checking remaining expired OTPs:", err);
        } else {
          const remainingOtpsCount = result[0].count;
          if (remainingOtpsCount === 0) {
            console.log("No expired OTPs remaining, stopping cron job");
            return; // Stop the cron job
          }
        }
      });
    }
  });
};

// Initial call to start the cron job
deleteExpiredOtps();

// Schedule task to run every 10 minutes
cron.schedule('*/10 * * * *', () => {
  deleteExpiredOtps();
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
    ticket_id,
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
    "INSERT INTO third_party_bookings (ticket_id, register_id, booking_date, departure_city, arrival_city, departure_datetime, arrival_datetime, num_travelers, booking_company, booking_type, total_price, additional_info) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const values = [
    ticket_id,
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


app.put("/updateBooking/:ticketId", (req, res) => {
  const ticketId = req.params.ticketId;
  const { track_id, userId } = req.query; // Extract track_id and userId from the query parameters
  const bookingData = req.body;

  // Extract booking data from the request body
  const {
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
    "UPDATE third_party_bookings SET booking_date = ?, departure_city = ?, arrival_city = ?, departure_datetime = ?, arrival_datetime = ?, num_travelers = ?, booking_company = ?, booking_type = ?, total_price = ?, additional_info = ? WHERE track_id = ? AND register_id = ? AND ticket_id = ?";
  const values = [
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
    track_id,
    userId,
    ticketId,
  ];

  // Update booking data in the database
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error updating booking:", err);
      return res.status(500).json({ error: "Failed to update booking" });
    } else {
      return res.json({ status: "success" });
    }
  });
});


app.delete("/deleteBooking/:ticketId", (req, res) => {
  const ticketId = req.params.ticketId;
  const { track_id, userId } = req.query; // Extract track_id and userId from the query parameters

  // Prepare SQL query
  const sql = "DELETE FROM third_party_bookings WHERE track_id = ? AND register_id = ?  AND ticket_id = ?" ;
  const values = [track_id, userId, ticketId];

  // Delete booking data from the database
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error deleting booking:", err);
      return res.status(500).json({ error: "Failed to delete booking" });
    } else {
      return res.json({ status: "success" });
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
  const ticket_id = flightData.ticket_id;
  const sql =
    "INSERT INTO booked_flights (ticket_id, register_id, arrival, arrival_city, arrival_time, departure, departure_city, departure_time, airline, price, num_travelers, total_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const values = [
    ticket_id,
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
    "INSERT INTO travellers (ticket_id, register_id, name, age, gender) VALUES (?, ?, ?, ?, ?)";

  // Insert each traveler into the database
  travelers.forEach((traveler) => {
    const { ticket_id, user_id, name, age, gender } = traveler;
    const values = [ticket_id, user_id, name, age, gender];
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
app.get("/generate-and-download-ticket/:userId/:ticketId", (req, res) => {
  const userId = req.params.userId;
  const ticketId = req.params.ticketId;
  generateAndDownloadTicket(userId, ticketId)
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
