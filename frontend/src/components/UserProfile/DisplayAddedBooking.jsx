import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoMdHome } from "react-icons/io";
import { Link } from "react-router-dom";

 export const DisplayAddedBooking = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    axios
      .get(`http://localhost:8080/third-party-bookings/${userId}`)
      .then((res) => {
        setBookings(res.data);
      })
      .catch((err) => {
        console.error("Error fetching third party bookings:", err);
      });
  }, []);

  // Function to format date time to IST
  const formatDateTimeToIST = (dateTimeString) => {
    const options = {
      timeZone: "Asia/Kolkata",
      hour12: true,
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return new Date(dateTimeString).toLocaleString("en-IN", options);
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mt-3 text-primary">
        <h2>Added Bookings</h2>
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
            <th style={{ color: "purple" }}>Booking Date</th>
            <th style={{ color: "purple" }}>Departure City</th>
            <th style={{ color: "purple" }}>Arrival City</th>
            <th style={{ color: "purple" }}>Departure Datetime</th>
            <th style={{ color: "purple" }}>Arrival Datetime</th>
            <th style={{ color: "purple" }}>Number of Travelers</th>
            <th style={{ color: "purple" }}>Booking Company</th>
            <th style={{ color: "purple" }}>Booking Type</th>
            <th style={{ color: "purple" }}>Total Price</th>
            <th style={{ color: "purple" }}>Additional Info</th>
          </tr>
        </thead>
        <tbody>
        {bookings.map((booking) => (
        <tr key={booking.register_id}>
        <td>{booking.booking_date ? new Date(booking.booking_date).toLocaleDateString("en-IN") : "-"}</td>
        <td>{booking.departure_city || "-"}</td>
        <td>{booking.arrival_city || "-"}</td>
        <td>{booking.departure_datetime ? formatDateTimeToIST(booking.departure_datetime) : "-"}</td>
        <td>{booking.arrival_datetime ? formatDateTimeToIST(booking.arrival_datetime) : "-"}</td>
        <td>{booking.num_travelers || "-"}</td>
        <td>{booking.booking_company || "-"}</td>
        <td>{booking.booking_type || "-"}</td>
        <td>{booking.total_price || "-"}</td>
        <td>{booking.additional_info || "-"}</td>
        </tr>
    ))}

        </tbody>
      </table>
    </div>
  );
};

// export default DisplayAddedBooking;
