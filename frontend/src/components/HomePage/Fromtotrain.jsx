// Fromto.jsx
import React, { useEffect, useState } from "react";
import { Fromtocss } from "./Fromtocss";

export const Fromto = ({ handleChange }) => {
  const [text, setText] = useState([]);
  const [departureDate, setDepartureDate] = useState("");
  const [travelClass, setTravelClass] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://gist.githubusercontent.com/apsdehal/11393083/raw/8faed8c05737c62fa04286cce21312951652fff4/Railway%2520Stations"
        );
        const data = await response.json();
        setText(data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setDepartureDate(selectedDate);
    handleChange({ target: { name: "departureDate", value: formatDate(selectedDate) } });
  };
  
  const formatDate = (dateString) => {
    // Ensure the date string is in the format YYYYMMDD
    const [year, month, day] = dateString.split("-");
    return `${year}${month}${day}`;
  };
  
  const handleClassChange = (e) => {
    const selectedClass = e.target.value;
    setTravelClass(selectedClass);
    handleChange({ target: { name: "travelClass", value: selectedClass } });
  };

  return (
    <Fromtocss>
      <div className="fromtodiv">
        <div>
          <h3>FROM</h3>
          <select onChange={handleChange} name="from">
            {text.map((station) => (
              <option value={station.code} key={station.code}>
                {station.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <h3>TO</h3>
          <select onChange={handleChange} name="to">
            {text.map((station) => (
              <option value={station.code} key={station.code}>
                {station.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="fromtodiv2">
        <div>
          <h3>DEPARTURE</h3>
          <input type="date" className="date" id="date" onChange={handleDateChange} name="departureDate" />
        </div>
        <div>
          <h3>CLASS</h3>
          <select onChange={handleClassChange} name="travelClass">
            <option defaultChecked value="">Select</option>
            <option value="">ALL</option>
            <option value="SL">SLEEPER</option>
            <option value="1A">FIRST AC</option>
            <option value="2A">SECOND AC</option>
            <option value="3A">THIRD AC</option>
          </select>
        </div>
      </div>
    </Fromtocss>
  );
};
