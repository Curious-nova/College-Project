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
    }
  };

  const handleSearch = async () => {
    try {
      const hotelData = await searchHotels(checkInDate, checkOutDate, guests);
      setData(hotelData.data); // Assuming the response structure is similar to trainData
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
    }
  };

  const searchHotels = async (checkInDate, checkOutDate, guests) => {
    const options = {
      method: 'GET',
      url: 'YOUR_HOTEL_API_ENDPOINT', // Update this with your hotel API endpoint
      params: { checkInDate, checkOutDate, guests }, // Update parameter names accordingly
      headers: {
        'Authorization': 'Bearer YOUR_AUTH_TOKEN', // Include necessary authorization token
        'Content-Type': 'application/json'
      }
    };

    try {
      const response = await axios.request(options);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch hotel data");
    }
  };

  const bookData = () => {
    localStorage.setItem("buy", JSON.stringify(dataa));
  };

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
        <Bottom />
      </div>
      {error && <p>Error: {error}</p>}
      {hotelData && <SearchBox handle={handleSearch} />} {/* Update according to your UI */}
      <Bottom data={dataa} bookData={bookData} />
    </div>
  );
};
