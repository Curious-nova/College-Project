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
import { CabSearchForm } from "../HomePage/fromto_cab";

export const Cab = () => {
  const [data, setData] = useState([]);
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [passengers, setPassengers] = useState(1);

  const [cabData, setCabData] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "pickupLocation") {
      setPickupLocation(value);
    } else if (name === "dropLocation") {
      setDropLocation(value);
    } else if (name === "travelDate") {
      setTravelDate(value);
    } else if (name === "passengers") {
      setPassengers(value);
    }
  };

  const handleSearch = async () => {
    try {
      const cabData = await searchCabs(pickupLocation, dropLocation, travelDate, passengers);
      setData(cabData.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
    }
  };

  const searchCabs = async (pickupLocation, dropLocation, travelDate, passengers) => {
    const options = {
      method: 'GET',
      url: 'YOUR_CAB_API_ENDPOINT',
      params: { pickupLocation, dropLocation, travelDate, passengers },
      headers: {
        'Authorization': 'Bearer YOUR_AUTH_TOKEN',
        'Content-Type': 'application/json'
      }
    };

    try {
      const response = await axios.request(options);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch cab data");
    }
  };

  const bookData = () => {
    localStorage.setItem("buy", JSON.stringify(data));
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
      {/* {error && <p>Error: {error}</p>}
      {cabData && <SearchBox handle={handleSearch} />} */}
      {/* <Bottom data={data} bookData={bookData} /> */}
    </div>
  );
};
