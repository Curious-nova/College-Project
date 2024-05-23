import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBookOpen } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { CiViewBoard } from "react-icons/ci";
import axios from "axios"; // Import axios for API calls

function UserProfile() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData);
        // You can add basic data validation here (optional)
        if (parsedData && parsedData.name && parsedData.email) {
          setUserName(parsedData.name);
          setEmail(parsedData.email);
          setLoading(false); // Data retrieved from localStorage
          return; // Exit the function if data is valid
        }
      } catch (err) {
        console.error("Error parsing stored user data:", err);
      }
    }

    const fetchUserDetails = async () => {
      const userId = localStorage.getItem("userId"); // Assuming you have userId stored elsewhere
      try {
        const response = await axios.get(`http://localhost:8080/getuserdetails?id=${userId}`);
        console.log("User details response:", response.data);
        setUserName(response.data.name);
        setEmail(response.data.email);
        localStorage.setItem("userData", JSON.stringify(response.data));
      } catch (err) {
        console.error("Error fetching user details:", err);
      } finally {
        setLoading(false); // Set loading to false after data is fetched/attempted
      }
    };
    fetchUserDetails();
  }, []); // Empty dependency array for initial storage check only

  if (loading) {
    return <div>Loading...</div>;
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
            </div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <Link to="/bookings">
                <button
                  className="btn"
                  style={{ backgroundColor: "#800080", color: "white", padding: '5px 20px' }}
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
                  style={{ backgroundColor: "#008000", color: "white", padding: '5px 30px', marginLeft: '25px' }}
                >
                  <span>
                    <IoMdAdd />
                  </span>{" "}
                  Add Booking
                </button>
              </Link>
              <Link to="/display-added-booking">
                <button
                  className="btn"
                  style={{ backgroundColor: "#0000FF", color: "white", padding: '5px 10px', marginLeft: '25px' }}
                >
                  <span>
                    <CiViewBoard />
                  </span>{" "}
                  View Added Bookings
                </button>
              </Link>
            </div>
            <div className="mb-3">
              <h4>About Us</h4>
              <p className="text-center" style={{ fontSize: '16px', lineHeight: '1.3', textAlign: 'left', color: '#333' }}>
                Our team worked together on a DBMS group project where we developed a travel management and booking system BookMyTrip. 
                Using technologies like React.js, Node.js, Express.js, MySQL, Axios, Bootstrap, and Material UI, we created 
                a practical platform for travel operations. Our project focused on essential features like user authentication, 
                profile management, and booking functionalities. We aimed to provide users with a straightforward and efficient 
                solution for planning and managing as well as booking their trips. We would like to acknowledge the guidance and support
                provided by our professors, Dr. Ravi Bhandari Sir and Dr. Prasun Tripathi Sir, which enabled us to work on this project and 
                gain valuable experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;

