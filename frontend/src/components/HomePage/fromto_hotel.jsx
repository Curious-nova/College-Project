import { useEffect, useState } from "react";
import { Fromtocss } from "./Fromtocss";

export const HotelSearchForm = ({ handleChange }) => {
  const [cities, setCities] = useState([]);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(1); // Initial number of guests set to 1

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

  const handleCheckInDateChange = (e) => {
    const selectedDate = e.target.value;
    setCheckInDate(selectedDate);
    handleChange({ target: { name: "checkInDate", value: selectedDate } });
  };

  const handleCheckOutDateChange = (e) => {
    const selectedDate = e.target.value;
    setCheckOutDate(selectedDate);
    handleChange({ target: { name: "checkOutDate", value: selectedDate } });
  };

  const handleGuestsChange = (e) => {
    const selectedGuests = parseInt(e.target.value);
    setGuests(selectedGuests);
    handleChange({ target: { name: "guests", value: selectedGuests } });
  };

  return (
    <Fromtocss>
      <div className="fromtodiv">
        <div>
          <h3>DESTINATION</h3>
          <select onChange={handleChange} name="destination">
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
          <h3>CHECK-IN DATE</h3>
          <input type="date" className="date" onChange={handleCheckInDateChange} name="checkInDate" />
        </div>
        <div>
          <h3>CHECK-OUT DATE</h3>
          <input type="date" className="date" onChange={handleCheckOutDateChange} name="checkOutDate" />
        </div>
        <div>
          <h3>GUESTS</h3>
          <select onChange={handleGuestsChange} name="guests">
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
