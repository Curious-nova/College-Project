import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaBookOpen } from "react-icons/fa";

function UserProfile() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user details
    const userId = localStorage.getItem("userId"); // Fetch userId from localStorage
    axios
      .get(`http://localhost:8080/getuserdetails?id=${userId}`) // Send request to getuserdetails route with userId as query parameter
      .then((res) => {
        console.log("User details response:", res.data); // Log the response data
        setUserName(res.data.name);
        setEmail(res.data.email);
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch((err) => {
        console.error("Error fetching user details:", err);
        setLoading(false); // Set loading to false on error
      });
  }, []); // Empty dependency array because we only want this effect to run once on component mount

  if (loading) {
    return <div>Loading...</div>; // Display loading indicator while fetching data
  }

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

              <Link to="/bookings">
                <button
                  className="btn"
                  style={{ backgroundColor: "purple", color: "white" }}
                >
                  <span className="me-2">
                    <FaBookOpen />
                  </span>
                  My Bookings
                </button>
              </Link>
              
              <Link to="/add-booking">
                <button
                  className="btn"
                  style={{ backgroundColor: "green", color: "white" }}
                >
                  Add Booking
                </button>
              </Link>

              {/* Button to view added bookings */}
              <Link to="/display-added-booking">
                <button
                  className="btn"
                  style={{ backgroundColor: "blue", color: "white" }}
                >
                  View Added Bookings
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
