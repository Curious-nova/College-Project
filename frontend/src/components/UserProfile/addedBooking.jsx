import React, { useState } from "react";
import axios from "axios";

export const AddBooking = () => {
  const [formData, setFormData] = useState({
    register_id: localStorage.getItem("userId"),
    booking_date: "",
    departure_city: "",
    arrival_city: "",
    departure_datetime: "",
    arrival_datetime: "",
    num_travelers: "",
    booking_company: "",
    booking_type: "",
    total_price: "",
    additional_info: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8080/add-booking", formData)
      .then((res) => {
        console.log("Booking added successfully:", res.data);
        // Optionally, redirect or show a success message to the user
      })
      .catch((err) => {
        console.error("Error adding booking:", err);
        // Optionally, show an error message to the user
      });
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Add Booking</h2>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="departure_city" className="form-label">
              Departure City:
            </label>
            <input
              type="text"
              className="form-control"
              id="departure_city"
              name="departure_city"
              value={formData.departure_city}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="arrival_city" className="form-label">
              Arrival City:
            </label>
            <input
              type="text"
              className="form-control"
              id="arrival_city"
              name="arrival_city"
              value={formData.arrival_city}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="departure_datetime" className="form-label">
              Departure Datetime:
            </label>
            <input
              type="datetime-local"
              className="form-control"
              id="departure_datetime"
              name="departure_datetime"
              value={formData.departure_datetime}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="arrival_datetime" className="form-label">
              Arrival Datetime:
            </label>
            <input
              type="datetime-local"
              className="form-control"
              id="arrival_datetime"
              name="arrival_datetime"
              value={formData.arrival_datetime}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="booking_date" className="form-label">
              Booking Date:
            </label>
            <input
              type="date"
              className="form-control"
              id="booking_date"
              name="booking_date"
              value={formData.booking_date}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="num_travelers" className="form-label">
              Number of Travelers:
            </label>
            <input
              type="number"
              className="form-control"
              id="num_travelers"
              name="num_travelers"
              value={formData.num_travelers}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="booking_company" className="form-label">
              Booking Company:
            </label>
            <input
              type="text"
              className="form-control"
              id="booking_company"
              name="booking_company"
              value={formData.booking_company}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="booking_type" className="form-label">
              Booking Type:
            </label>
            <select
              className="form-select"
              id="booking_type"
              name="booking_type"
              value={formData.booking_type}
              onChange={handleChange}
            >
              <option value="">Select Type</option>
              <option value="Flight">Flight</option>
              <option value="Train">Train</option>
              <option value="Hotel">Hotel</option>
              <option value="Bus">Bus</option>
              <option value="Holiday Package">Holiday Package</option>
              <option value="Intercity">Intercity</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="total_price" className="form-label">
              Total Price:
            </label>
            <input
              type="number"
              className="form-control"
              id="total_price"
              name="total_price"
              value={formData.total_price}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-12 mb-3">
            <label htmlFor="additional_info" className="form-label">
              Additional Information:
            </label>
            <textarea
              className="form-control"
              id="additional_info"
              name="additional_info"
              value={formData.additional_info}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>
        <div className="d-grid">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};
