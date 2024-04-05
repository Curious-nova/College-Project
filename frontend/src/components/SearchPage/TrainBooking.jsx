import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Header } from "../HomePage/Header";
import { Navbar } from "../HomePage/Navbar";
import { Icondiv } from "../HomePage/Icondiv";
import { Bookingcss } from "../HomePage/Bookingcss";
//import { Fromto } from "./Fromtoom";
import { FareTypes } from "../HomePage/FareTypes";
import { Bottom } from "../HomePage/Bottom";
import { Login } from "../login/Login";
import { Link, useHistory } from "react-router-dom";
import { SmallBottom } from "../HomePage/SmallBottom";
import bmtLogo from './bmt_logo.jpg';
import { SearchBox } from "../SearchPage/SearchBox";
import {Fromto} from "../HomePage/Fromtoom"

export const TrainBooking = () => {
  const [dataa, setData] = useState([]);
  const [departureDate, setDepartureDate] = useState("");
  const [travelClass, setTravelClass] = useState("");
  const [searchParams, setSearchParams] = useState({
    from: "",
    to: "",
    departureDate: "",
    travelClass: "" // Added travelClass to the state
  });

  const [trainData, setTrainData] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = async () => {
    try {
      setDepartureDate(searchParams.departureDate); // Update departure date
      setTravelClass(searchParams.travelClass);
      const trainData = await searchTrains(searchParams); // Use searchTrains function
      setData(trainData.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
    }
  };

  const searchTrains = async ({ from, to, departureDate, travelClass }) => {
    const options = {
      method: 'GET',
      url: 'https://irctc1.p.rapid, api.com/api/v1/searchStation',
      params: { from, to, departureDate, travelClass },
      headers: {
        'X-RapidAPI-Key': '4ec154cc17mshfb1a17a88a74772p159e36jsn6467a42c7d46',
        'X-RapidAPI-Host': 'irctc1.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch train data");
    }
  };

  const bookData = () => {
    localStorage.setItem("buy", JSON.stringify(dataa));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = localStorage.getItem("myKey");
        if (!storedData) {
          throw new Error("No data found in localStorage");
        }
        const { from, to, departureDate, travelClass } = JSON.parse(storedData);
        const trainData = await searchTrains({ from, to, departureDate, travelClass }); // Use searchTrains function
        setData(trainData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      }
    };

    fetchData();

    return () => {
      // Clean-up function to handle component unmount
    };

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
        </div>
        <Bookingcss>
          <Icondiv className="icondiv"></Icondiv>
          <Fromto handleChange={handleChange} />
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
      {trainData && <SearchBox handle={handleSearch} />}
      <Bottom data={dataa} bookData={bookData} /> */}
    </div>
    
  );
};