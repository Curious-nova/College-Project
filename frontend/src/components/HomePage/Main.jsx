/* eslint-disable no-restricted-globals */

import { Navbar } from "./Navbar";
import { Smallbutton } from "./Smallbutton";
import BusinessIcon from "@mui/icons-material/Business";
import { Icondiv } from "./Icondiv";
import { Bookingcss } from "./Bookingcss";
import { Fromto } from "./Fromto";
import { MultipleSlidesExample, BigSlidesExample } from "./Slidebar";
import { Bottom } from "./Bottom";
import { Header } from "./Header";
import { Link } from "react-router-dom";
import { SmallBottom } from "./SmallBottom";
import { useState, useEffect } from "react";
import { FareTypes } from "./FareTypes";
import { Login } from "../login/Login";
import bmtLogo from "./bmt_logo.jpg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IoMdLogOut } from "react-icons/io";
import { FaSearch } from "react-icons/fa";

export const Main = () => {
  const [data, setData] = useState({
    from: "",
    to: "",
    departureDate: "", // Added departureDate here
    travelClass: "",
  });

  const handleData = (e) => {
    const { name, value } = e.target;
    if (name === "date") {
      // Check if the input is for the date
      setData({ ...data, departureDate: value }); // Set departureDate property
    } else {
      setData({ ...data, [name]: value });
    }
  };

  const addLocal = () => {
    localStorage.setItem("myKey", JSON.stringify(data));
  };
  const navigate = useNavigate();

  const [auth, setAuth] = useState(false);

  const handleLogout = () => {
    axios
      .get("http://localhost:8080/logout", { withCredentials: true })
      .then((res) => {
        if (res.data.status === "success") {
          setAuth(false); // Set auth state to false upon successful logout
          navigate("/"); // Navigate to the homepage
        } else {
          console.log("Logout failed:", res.data); // Handle logout failure
        }
      })
      .catch((err) => {
        console.log("Error during logout:", err); // Handle logout error
      });
  };

  useEffect(() => {
    axios
      .get("http://localhost:8080/", { withCredentials: true })
      .then((res) => {
        if (res.data.status === "success") {
          setAuth(true);
        } else {
          setAuth(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setAuth(false); // Set auth to false in case of errors
      });
  }, []);

  return (
    <div>
      <Header></Header>
      <Navbar>
        <div className="topdiv">
          <img className="laltain" src="" alt="" />
          <Link to="/">
            <img
              src={bmtLogo}
              className="mmtlogo"
              alt="Logo"
              style={{ width: "130px", height: "80px", paddingTop: "20px" }}
            />
          </Link>
          {auth ? (
            <>
              <div className="d-flex justify-content-center align-items-end">
                <button className="btn">
                  <Link to="/user">
                    <img
                      className="rounded-circle mt-5"
                      width="40px"
                      src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
                      alt="Profile"
                    />
                  </Link>
                </button>
              </div>
              <div className="logout">
                <button onClick={handleLogout} className="btn btn-danger">
                  <span>
                    <IoMdLogOut />
                  </span>{" "}
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="login">
                <Link to="/login" className="btn btn-danger">
                  Login
                </Link>
              </div>
              <div className="register">
                <Link to="/register" className="btn btn-primary">
                  Register
                </Link>
              </div>
            </>
          )}
        </div>
        <Bookingcss>
          <Icondiv className="icondiv"></Icondiv>
          <div className="checkboxdiv">
            <div>
              <input type="checkbox" />
              <label htmlFor="">ONEWAY</label>
              <input type="checkbox" />
              <label htmlFor="">ROUNDTRIP</label>
            </div>
          </div>
          <Fromto handleChange={handleData} />
          <FareTypes />
        </Bookingcss>
        <div className="button">
          <button onClick={addLocal}>
            <Link to="/search">
              {" "}
              <span>
                <FaSearch />
              </span>{" "}
              SEARCH
            </Link>
          </button>
        </div>
      </Navbar>
      <div style={{ background: "#ebe7e7", paddingTop: "50px" }}>
        <SmallBottom />
        <div style={{ width: "90%", margin: "auto" }}>
          <MultipleSlidesExample />
        </div>
        <Bottom />
      </div>
    </div>
  );
};
