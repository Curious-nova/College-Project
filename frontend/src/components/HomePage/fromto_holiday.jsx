import React, { useState, useEffect } from "react";
import { Fromtocss } from "./Fromtocss";

export const FromtoHoliday = ({ handleChange }) => {
  const [cities, setCities] = useState([]);
  const [budget, setBudget] = useState("1,30000");
  const [travelMonth, setTravelMonth] = useState("5-2024");

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/ashhadulislam/JSON-Airports-India/master/airports.json"
        );
        const data = await response.json();
        setCities(data.airports);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    fetchCities();
  }, []);

  const handleBudgetChange = (e) => {
    setBudget(e.target.value);
    handleChange(e); // Pass the event to handleChange
  };

  const handleTravelMonthChange = (e) => {
    setTravelMonth(e.target.value);
    handleChange(e); // Pass the event to handleChange
  };

  return (
    <Fromtocss>
      <div className="fromtodiv">
        <div>
          <h3>DESTINATION</h3>
          <select onChange={handleChange} name="destination">
            {cities.map((city) => (
              <option value={city.city_name} key={city.IATA_code}>
                {city.city_name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="fromtodiv2">
        <div>
          <h3>BUDGET PER PERSON</h3>
          <select onChange={handleBudgetChange} name="budget">
            <option defaultChecked value="">Select</option>
            <option value="1,30000">Less than 30,000</option>
            <option value="30000,100000">30,000 - 1,00,000</option>
            <option value="100000,200000">1,00,000 - 2,00,000</option>
            <option value="200000,0">More than 2,00,000</option>
          </select>
        </div>
        <div>
          <h3>TRAVEL MONTH</h3>
          <input
            type="month"
            className="date"
            onChange={handleTravelMonthChange}
            name="travelMonth"
          />
        </div>
      </div>
    </Fromtocss>
  );
};
