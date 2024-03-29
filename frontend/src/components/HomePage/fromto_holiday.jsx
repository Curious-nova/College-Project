import React, { useEffect, useState } from "react";
import { Fromtocss } from "./Fromtocss";

export const HolidayPackageSearchForm = ({ handleChange }) => {
  const [destinations, setDestinations] = useState([]);
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [travelers, setTravelers] = useState(1); // Initial number of travelers set to 1

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/ashhadulislam/JSON-Airports-India/master/airports.json"
        );
        const data = await response.json();
        setDestinations(data.airports);
      } catch (error) {
        console.error("Error fetching destinations:", error);
      }
    };
    fetchDestinations();
  }, []);

  const handleDepartureDateChange = (e) => {
    const selectedDate = e.target.value;
    setDepartureDate(selectedDate);
    handleChange({ target: { name: "departureDate", value: selectedDate } });
  };

  const handleReturnDateChange = (e) => {
    const selectedDate = e.target.value;
    setReturnDate(selectedDate);
    handleChange({ target: { name: "returnDate", value: selectedDate } });
  };

  const handleTravelersChange = (e) => {
    const selectedTravelers = parseInt(e.target.value);
    setTravelers(selectedTravelers);
    handleChange({ target: { name: "travelers", value: selectedTravelers } });
  };

  return (
    <Fromtocss>
      <div className="holiday-packages-div">
        <div>
          <h3>DESTINATION</h3>
          <select onChange={handleChange} name="destination">
            {destinations.map((destination) => (
              <option value={destination.IATA_code} key={destination.IATA_code}>
                {destination.city_name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="holiday-packages-div2">
        <div>
          <h3>DEPARTURE DATE</h3>
          <input type="date" className="date" onChange={handleDepartureDateChange} name="departureDate" />
        </div>
        <div>
          <h3>RETURN DATE</h3>
          <input type="date" className="date" onChange={handleReturnDateChange} name="returnDate" />
        </div>
        <div>
          <h3>TRAVELERS</h3>
          <select onChange={handleTravelersChange} name="travelers">
            {[...Array(10).keys()].map((num) => (
              <option value={num + 1} key={num + 1}>
                {num + 1}
              </option>
            ))}
          </select>
        </div>
      </div>
    </Fromtocss>
  );
};
