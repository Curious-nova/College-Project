import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { IoMdHome } from "react-icons/io";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    axios
      .get(`http://localhost:8080/booking-flights/${userId}`)
      .then((res) => {
        setBookings(res.data);
      })
      .catch((err) => {
        console.error("Error fetching booking flights:", err);
      });
  }, []);

  return (
    <div className="container ">
      <div className="d-flex justify-content-between align-items-center mt-3 text-primary">
        <h2 className="  ">Booked Flights</h2>
        <Link to="/">
          <button
            className="btn"
            style={{ backgroundColor: "#5783db", color: "white" }}
          >
            <span>
              <IoMdHome />
            </span>
          </button>
        </Link>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th style={{ color: "purple" }}>Arrival</th>
            <th style={{ color: "purple" }}>Arrival City</th>
            <th style={{ color: "purple" }}>Arrival Time</th>
            <th style={{ color: "purple" }}>Departure</th>
            <th style={{ color: "purple" }}>Departure City</th>
            <th style={{ color: "purple" }}>Departure Time</th>
            <th style={{ color: "purple" }}>Airline</th>
            <th style={{ color: "purple" }}>Price</th>
            <th style={{ color: "purple" }}>Number of Travelers</th>
            <th style={{ color: "purple" }}>Total Price</th>
            <th style={{ color: "purple" }}>Carry-on Baggage Weight</th>
            <th style={{ color: "purple" }}>Check-in Baggage Weight</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.register_id}>
              <td>{booking.arrival}</td>
              <td>{booking.arrival_city}</td>
              <td>{booking.arrival_time}</td>
              <td>{booking.departure}</td>
              <td>{booking.departure_city}</td>
              <td>{booking.departure_time}</td>
              <td>{booking.airline}</td>
              <td>{booking.price}</td>
              <td>{booking.num_travelers}</td>
              <td>{booking.total_price}</td>
              <td>{booking.carryon_baggage_weight}</td>
              <td>{booking.checkin_baggage_weight}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Bookings;
