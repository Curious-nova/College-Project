import React, { useEffect, useState } from "react";
import axios from "axios";

function UserProfile() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [bookingFlights, setBookingFlights] = useState([]);

  useEffect(() => {
    // Fetch user details
    axios
      .get("http://localhost:8080/")
      .then((res) => {
        const userData = res.data;
        setUserName(userData.name);
        setEmail(userData.email);
      })
      .catch((err) => {
        console.error("Error fetching user details:", err);
      });

    // Fetch booking flights
    const userId = localStorage.getItem("userId");
    axios
      .get(`http://localhost:8080/booking-flights/${userId}`)
      .then((res) => {
        setBookingFlights(res.data);
      })
      .catch((err) => {
        console.error("Error fetching booking flights:", err);
      });
  }, []);

  return (
    <div className="container rounded bg-white mt-5 mb-5">
      <div className="row">
        <div className="col-md-3 border-right">
          <div className="d-flex flex-column align-items-center text-center p-3 py-5">
            <img
              className="rounded-circle mt-5"
              width="150px"
              src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
              alt="Profile"
            />
            <span className="font-weight-bold">{userName}</span>
            <span className="text-black-50">{email}</span>
          </div>
        </div>
        <div className="col-md-5 border-right">
          <div className="p-3 py-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="text-right">Profile Settings</h4>
            </div>
            <div>
              <h5>Booking Flights:</h5>
              <ul>
                {bookingFlights.map((flight) => (
                  <li key={flight.id}>
                    Flight Details: {flight.departure} to {flight.arrival}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
