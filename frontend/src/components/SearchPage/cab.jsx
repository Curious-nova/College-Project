import React, { useState } from "react";
import { Header } from "../HomePage/Header";
import { Navbar } from "../HomePage/Navbar";
import { Icondiv } from "../HomePage/Icondiv";
import { Bookingcss } from "../HomePage/Bookingcss";
import { Bottom } from "../HomePage/Bottom";
import { Link } from "react-router-dom";
import { SmallBottom } from "../HomePage/SmallBottom";
import bmtLogo from './bmt_logo.jpg';
import { CabSearchForm } from "../HomePage/fromto_cab";

export const Cab = () => {
  const [searchParams, setSearchParams] = useState({
    pickupLocation: "",
    dropoffLocation: "", // Corrected to dropoffLocation
    travelDate: "",
    passengers: ""
  });

  const handleChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = () => {
    const { pickupLocation, dropoffLocation } = searchParams;
    // Construct the URL with parameters
    const url = `https://oneway.cab/outstation/${pickupLocation}-to-${dropoffLocation}-taxi`;
    // Redirect to the constructed URL
    window.location.href = url;
  };

  return (
    <div>
      <Header />
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
          <CabSearchForm handleChange={handleChange} /> 
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