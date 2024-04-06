const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mysql = require("mysql");
const bodyParser = require("body-parser");

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// DB connection
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

  const sql =
    "INSERT INTO booked_flights (arrival, arrival_city, arrival_time, departure, departure_city, departure_time, airline, price, num_travelers, total_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const values = [
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

const flightPort = process.env.FLIGHT_PORT || 8081;
app.listen(flightPort, () => {
  console.log(`Flight details server is running on port ${flightPort}`);
});

// Route to store traveler details
app.post("/storeTravelerDetails", (req, res) => {
  const travelers = req.body.travelers;

  // Prepare SQL query
  const sql =
    "INSERT INTO travellers (name, age, gender) VALUES (?, ?, ?)";

  // Insert each traveler into the database
  travelers.forEach((traveler) => {
    const { name, age, gender } = traveler;
    const values = [name, age, gender];
    db.query(sql, values, (err, result) => {
      if (err) {
        console.log(err);
        return res.json({ Error: "Failed to store traveler details" });
      }
    });
  });

  return res.json({ status: "success" });
});

const travelerPort = process.env.TRAVELER_PORT || 8082;
app.listen(travelerPort, () => {
  console.log(`Traveler details server is running on port ${travelerPort}`);
});
