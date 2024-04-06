// TrainBooking.jsx
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Header } from "../HomePage/Header";
import { Navbar } from "../HomePage/Navbar";
import { Icondiv } from "../HomePage/Icondiv";
import { Bookingcss } from "../HomePage/Bookingcss";
import { Fromto } from "../HomePage/Fromtotrain";
import { Bottom } from "../HomePage/Bottom";
import { Link } from "react-router-dom";
import { SmallBottom } from "../HomePage/SmallBottom";
import bmtLogo from './bmt_logo.jpg';

export const TrainBooking = () => {
  const [error, setError] = useState(null);
  const [stations, setStations] = useState([]);
  const [searchParams, setSearchParams] = useState({
    from: "",
    to: "",
    departureDate: "",
    travelClass: ""
  });

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await fetch(
          "https://gist.githubusercontent.com/apsdehal/11393083/raw/8faed8c05737c62fa04286cce21312951652fff4/Railway%2520Stations"
        );
        const data = await response.json();
        setStations(data.data);
      } catch (error) {
        console.error("Error fetching stations data:", error);
      }
    };
    fetchStations();
  }, []);

  const handleChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = async () => {
    try {
      const { from, to, departureDate, travelClass } = searchParams;
      const destCity = stations.find(item => item.code === to)?.name || '';
      const srcCity = stations.find(item => item.code === from)?.name || '';
      const url = `https://www.makemytrip.com/railways/listing/?classCode=${travelClass}&date=${departureDate}&destCity=${destCity}&destStn=${to}&srcCity=${srcCity}&srcStn=${from}`;
      
      window.location.href = url;
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
    }
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
          {/* Pass stations data to Fromto */}
          <Fromto handleChange={handleChange} stations={stations}/>
        </Bookingcss>
        <div className="button">
          <button onClick={handleSearch}>SEARCH</button>
        </div>
      </Navbar>
      <div style={{ background: "#ebe7e7", paddingTop: "50px" }}>
        <SmallBottom />
        <Bottom />
      </div>
    </div>
  );
};
