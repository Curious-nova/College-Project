import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Header } from "../HomePage/Header";
import { Navbar } from "../HomePage/Navbar";
import { Icondiv } from "../HomePage/Icondiv";
import { Bookingcss } from "../HomePage/Bookingcss";
import { FareTypes } from "../HomePage/FareTypes";
import { Bottom } from "../HomePage/Bottom";
import { Link, useHistory } from "react-router-dom";
import { SmallBottom } from "../HomePage/SmallBottom";
import bmtLogo from './bmt_logo.jpg'; // Replace with actual logo image
import { SearchBox } from "../SearchPage/SearchBox";
import { HolidayPackageSearchForm } from "../HomePage/fromto_holiday";

export const HolidayPackages = () => {
  const [data, setData] = useState([]);
  const [destination, setDestination] = useState("");
  const [packageType, setPackageType] = useState("");
  const [searchParams, setSearchParams] = useState({
    from: "",
    to: "",
    destination: "",
    packageType: ""
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = async () => {
    try {
      setDestination(searchParams.destination);
      setPackageType(searchParams.packageType);
      const packageData = await searchPackages(searchParams);
      setData(packageData.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
    }
  };

  const searchPackages = async ({ from, to, destination, packageType }) => {
    const options = {
      method: 'GET',
      url: 'https://holiday-packages-api.com/api/v1/searchPackages',
      params: { from, to, destination, packageType },
      headers: {
        'X-API-Key': 'your-api-key-here',
        'X-API-Host': 'holiday-packages-api.com'
      }
    };

    try {
      const response = await axios.request(options);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch holiday package data");
    }
  };

  const bookData = () => {
    localStorage.setItem("buy", JSON.stringify(data));
  };

  return (
    <div>
      <Header />
      <Navbar>
        <div className="topdiv">
          <img
            className="laltain"
            src="" // Replace with actual image URL
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
          <HolidayPackageSearchForm handleChange={handleChange} />
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
