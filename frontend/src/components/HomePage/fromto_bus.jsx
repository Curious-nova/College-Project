import React, { useEffect, useState } from "react";
import { Fromtocss } from "./Fromtocss";

export const BusSearchForm = ({ handleChange }) => {
  const [cities, setCities] = useState([]);
  const [departureDate, setDepartureDate] = useState("");
  const [travelClass, setTravelClass] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/ashhadulislam/JSON-Airports-India/master/airports.json"
        );
        const data = await response.json();
        setCities(data.airports);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleDepartureDateChange = (e) => {
    const selectedDate = e.target.value;
    setDepartureDate(selectedDate);
    handleChange({ target: { name: "departureDate", value: selectedDate } });
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
            {cities.map((city) => (
              <option value={city.IATA_code} key={city.IATA_code}>
                {city.city_name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <h3>TO</h3>
          <select onChange={handleChange} name="to">
            {cities.map((city) => (
              <option value={city.IATA_code} key={city.IATA_code}>
                {city.city_name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="fromtodiv2">
        <div>
          <h3>DEPARTURE DATE</h3>
          <input type="date" className="date" onChange={handleDepartureDateChange} name="departureDate" />
        </div>
        <div>
          <h3>TRAVEL CLASS</h3>
          <select onChange={handleClassChange} name="travelClass">
            <option defaultChecked value="">Select</option>
            <option value="AC SLEEPER">AC SLEEPER</option>
            <option value="NON-AC SLEEPER">NON-AC SLEEPER</option>
            <option value="AC SEATER">AC SEATER</option>
            <option value="NON-AC SEATER">NON-AC SEATER</option>
          </select>
        </div>
      </div>
    </Fromtocss>
  );
};
