import React, { useState } from "react";
import { Header } from "../HomePage/Header";
import { Navbar } from "../HomePage/Navbar";
import { Icondiv } from "../HomePage/Icondiv";
import { Bookingcss } from "../HomePage/Bookingcss";
import { FromtoHoliday } from "../HomePage/fromto_holiday"; // Corrected import
import { Bottom } from "../HomePage/Bottom";
import { Link } from "react-router-dom";
import { SmallBottom } from "../HomePage/SmallBottom";
import bmtLogo from './bmt_logo.jpg';

export const Holiday = () => {
  const [searchParams, setSearchParams] = useState({
    destination: "",
    budget: "",
    travelMonth: ""
  });

  const handleChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearchClick = () => {
    // Redirect logic here
    const { destination, budget, travelMonth } = searchParams;
    const month = parseInt(travelMonth.split("-")[1], 10) - 1; // Adjust month to be 1 less
    const formattedMonth = month < 10 ? `${month}` : `${month}`; // Add leading zero if necessary
    const year = travelMonth.split("-")[0];
    const destinationSlug = destination.toLowerCase().replace(/\s+/g, "-");
    window.location.href = `https://www.thomascook.in/holidays/india-tour-packages/${destinationSlug}-tour-packages?holidayBudget=${budget}&holidayMonth=${formattedMonth}-${year}`;
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
          <FromtoHoliday handleChange={handleChange} />
        </Bookingcss>
        <div className="button">
          <button onClick={handleSearchClick} className="search-button">SEARCH</button>
        </div>
      </Navbar>
      <div style={{ background: "#ebe7e7", paddingTop: "50px" }}>
        <SmallBottom />
        <Bottom />
      </div>
    </div>
  );
};
