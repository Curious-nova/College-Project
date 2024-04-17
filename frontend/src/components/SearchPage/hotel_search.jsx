import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Header } from "../HomePage/Header";
import { Navbar } from "../HomePage/Navbar";
import { Icondiv } from "../HomePage/Icondiv";
import { Bookingcss } from "../HomePage/Bookingcss";
import { FareTypes } from "../HomePage/FareTypes";
import { Bottom } from "../HomePage/Bottom";
// import { Login } from "../login/Login";
import { Link, useHistory } from "react-router-dom";
import { SmallBottom } from "../HomePage/SmallBottom";
import bmtLogo from './bmt_logo.jpg';
import { SearchBox } from "../SearchPage/SearchBox";
import { HotelSearchForm } from "../HomePage/fromto_hotel";

export const Hotel = () => {
  const [dataa, setData] = useState([]);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(1); // Initial number of guests set to 1
  const [destination, setDestination] = useState(""); // State for destination

  const [hotelData, setHotelData] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "checkInDate") {
      setCheckInDate(value);
    } else if (name === "checkOutDate") {
      setCheckOutDate(value);
    } else if (name === "guests") {
      setGuests(value);
    } else if (name === "destination") { // Handle destination change
      setDestination(value);
    }
  };

  const handleSearch = async () => {
    try {
      // Format check-in and check-out dates as dd/mm/yyyy
      const formattedCheckInDate = formatDate(checkInDate);
      const formattedCheckOutDate = formatDate(checkOutDate);
      // Redirect to the specified link including destination parameter and formatted dates
      window.location.href = `https://www.easemytrip.com/hotels/hotels-in-${destination}/?e=2024416201539&city=${destination}&cin=${formattedCheckInDate}&cOut=${formattedCheckOutDate}&Hotel=NA&Rooms=1&pax=${guests}`;
    } catch (error) {
      console.error("Error redirecting:", error);
      setError(error.message);
    }
  };
  
  // Function to format date as dd/mm/yyyy
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  

  // const bookData = () => {
  //   localStorage.setItem("buy", JSON.stringify(dataa));
  // };

  useEffect(() => {
    // You can add any necessary logic here for initial data fetching
  }, []);

  return (
    <div>
      <Header></Header>
      <Navbar>
        <div className="topdiv">
          <img
            className="laltain"
            src=""
            alt=""
          />
          <Link to="/">
            <img 
              src={bmtLogo}
              className="mmtlogo"
              alt="Logo"
              style={{width: '130px', height: '80px', paddingTop: '20px'}}
            />
          </Link>
          <div className="login">
            {/* <Login /> */}
          </div>
        </div>
        <Bookingcss>
          <Icondiv className="icondiv"></Icondiv>
          {/* You may need to adjust the component and its props based on your UI structure */}
          <HotelSearchForm handleChange={handleChange} /> 
        </Bookingcss>
        <div className="button">
          <button onClick={handleSearch}>
            SEARCH
          </button>
        </div>
      </Navbar>
      <div style={{ background: "#ebe7e7", paddingTop: "50px" }}>
        <SmallBottom />
      </div>
      {error && <p>Error: {error}</p>}
      {hotelData && <SearchBox handle={handleSearch} />} {/* Update according to your UI */}
      {/* <Bottom data={dataa} bookData={bookData} /> */}
    </div>
  );
};
