import { useEffect, useState } from "react";
import { Fromtocss } from "./Fromtocss";

export const CabSearchForm = ({ handleChange }) => {
  const [cities, setCities] = useState([]);
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [numPassengers, setNumPassengers] = useState(1); // Initial number of passengers set to 1

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

  const handlePickupLocationChange = (e) => {
    const selectedLocation = e.target.value;
    setPickupLocation(selectedLocation);
    handleChange({
      target: { name: "pickupLocation", value: selectedLocation },
    });
  };

  const handleDropoffLocationChange = (e) => {
    const selectedLocation = e.target.value;
    setDropoffLocation(selectedLocation);
    handleChange({
      target: { name: "dropoffLocation", value: selectedLocation },
    });
  };

  const handlePickupDateChange = (e) => {
    const selectedDate = e.target.value;
    setPickupDate(selectedDate);
    handleChange({ target: { name: "pickupDate", value: selectedDate } });
  };

  const handlePickupTimeChange = (e) => {
    const selectedTime = e.target.value;
    setPickupTime(selectedTime);
    handleChange({ target: { name: "pickupTime", value: selectedTime } });
  };

  const handlePassengersChange = (e) => {
    const selectedPassengers = parseInt(e.target.value);
    setNumPassengers(selectedPassengers);
    handleChange({
      target: { name: "numPassengers", value: selectedPassengers },
    });
  };

  return (
    <Fromtocss>
      <div className="fromtodiv">
        <div>
          <h3>PICKUP LOCATION</h3>
          <select onChange={handlePickupLocationChange} name="pickupLocation">
            {cities.map((city) => (
              <option value={city.city_name} key={city.IATA_code}>
                {city.city_name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <h3>DROPOFF LOCATION</h3>
          <select onChange={handleDropoffLocationChange} name="dropoffLocation">
            {cities.map((city) => (
              <option value={city.city_name} key={city.IATA_code}>
                {city.city_name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* <div className="fromtodiv2">
        <div>
          <h3>PICKUP DATE</h3>
          <input type="date" className="date" onChange={handlePickupDateChange} name="pickupDate" />
        </div>
        <div>
          <h3>PICKUP TIME</h3>
          <input type="time" className="time" onChange={handlePickupTimeChange} name="pickupTime" />
        </div>
        <div>
          <h3>PASSENGERS</h3>
          <select onChange={handlePassengersChange} name="numPassengers">
            {[...Array(10).keys()].map((num) => (
              <option value={num + 1} key={num + 1}>
                {num + 1}
              </option>
            ))}
          </select>
        </div>
      </div> */}
    </Fromtocss>
  );
};
