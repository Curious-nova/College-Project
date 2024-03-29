import { useEffect, useState } from "react";
import { Fromtocss } from "./Fromtocss";

export const Fromto = ({ handleChange }) => {
  const [text, setText] = useState([]);
  const [departureDate, setDepartureDate] = useState("");
  const [travelClass, setTravelClass] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/ashhadulislam/JSON-Airports-India/master/airports.json"
        );
        const data = await response.json();
        setText(data.airports);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setDepartureDate(selectedDate);
    handleChange({ target: { name: "date", value: selectedDate } });
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
            {text.map((e) => (
              <option value={e.IATA_code} key={e.IATA_code}>
                {e.city_name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <h3>TO</h3>
          <select onChange={handleChange} name="to">
            {text.map((e) => (
              <option value={e.IATA_code} key={e.IATA_code}>
                {e.city_name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="fromtodiv2">
        <div>
          <h3>DEPARTURE</h3>
          <input type="date" className="date" id="date" onChange={handleChange} name="date" />
        </div>
        <div>
          <h3>CLASS</h3>
          <select onChange={handleChange} name="travelClass">
            <option defaultChecked value="">Select</option>
            <option value="SLEEPER">SLEEPER</option>
            <option value="FIRST AC">FIRST AC</option>
            <option value="SECOND AC">SECOND AC</option>
            <option value="THIRD AC">THIRD AC</option>
          </select>
        </div>
      </div>
    </Fromtocss>
  );
};
