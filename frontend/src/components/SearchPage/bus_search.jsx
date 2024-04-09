// Bus.jsx
import React, { useState } from "react";
import { Header } from "../HomePage/Header";
import { Navbar } from "../HomePage/Navbar";
import { Icondiv } from "../HomePage/Icondiv";
import { Bookingcss } from "../HomePage/Bookingcss";
import { BusSearchForm } from "../HomePage/fromto_bus"; // Updated import
import { Bottom } from "../HomePage/Bottom";
import { Link } from "react-router-dom";
import { SmallBottom } from "../HomePage/SmallBottom";
import bmtLogo from './bmt_logo.jpg';

export const Bus = () => {
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [travelDate, setTravelDate] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "pickupLocation") {
      setPickupLocation(value);
    } else if (name === "dropLocation") {
      setDropLocation(value);
    } else if (name === "departureDate") {
      setTravelDate(value);
    }
  };

  const handleSearch = () => {
    const formattedDate = travelDate.split("-").reverse().join("-"); // Reformat date to dd-mm-yyyy
    const randomNumber1 = Math.ceil((Math.random() * 10) + 1); // Generate random numbers
    const randomNumber2 = randomNumber1 + 2;
    console.log(randomNumber1);
    console.log(randomNumber2);
    const url = `https://www.abhibus.com/bus_search/${pickupLocation}/${randomNumber1}/${dropLocation}/${randomNumber2}/${formattedDate}/O`;
    window.location.href = url; // Redirect using window.location.href
  };

  return (
    <div>
      <Header />
      <Navbar>
        <div className="topdiv">
          <img className="laltain" src="" alt="" />
          <Link to="/">
            <img 
              src={bmtLogo}
              className="mmtlogo"
              alt="Logo"
              style={{width: '130px', height: '80px', paddingTop: '20px'}}
            />
          </Link>
        </div>
        <Bookingcss>
          <Icondiv className="icondiv"></Icondiv>
          <BusSearchForm handleChange={handleChange} />
        </Bookingcss>
        <div className="button">
          <button onClick={handleSearch}>
            SEARCH
          </button>
        </div>
      </Navbar>
      <div style={{ background: "#ebe7e7", paddingTop: "50px" }}>
        <SmallBottom />
        <Bottom />
      </div>
    </div>
  );
};
