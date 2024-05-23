import React, { useState } from "react";
import axios from "axios";
import { Toast } from "react-bootstrap";
import { Link } from "react-router-dom";

// Define the initial state outside the component
const initialState = {
  register_id: localStorage.getItem("userId"),
  ticket_id: "",
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
};

export const AddBooking = () => {
  const [formData, setFormData] = useState(initialState);

  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const {
      ticket_id,
      booking_date,
      departure_city,
      arrival_city,
      departure_datetime,
      arrival_datetime,
      num_travelers,
      booking_type,
      total_price,
    } = formData;

    // Check if required fields are not null
    if (
      !ticket_id ||
      !booking_date ||
      !departure_city ||
      !arrival_city ||
      !departure_datetime ||
      !arrival_datetime ||
      !num_travelers ||
      !booking_type ||
      !total_price
    ) {
      setShowErrorToast(true);
      return;
    }

    axios
      .post("http://localhost:8080/add-booking", formData)
      .then((res) => {
        console.log("Booking added successfully:", res.data);
        setShowSuccessToast(true);
        setFormData(initialState); // Reset form data to initial state
      })
      .catch((err) => {
        console.error("Error adding booking:", err);
        setShowErrorToast(true);
      });
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4" style={{ color: "#5783db" }}>Add Booking</h2>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="ticket_id" className="form-label">
              Ticket ID<span style={{ color: "red" }}>*</span>:
            </label>
            <input
              type="number"
              className="form-control border-dark"
              id="ticket_id"
              name="ticket_id"
              value={formData.ticket_id}
              onChange={handleChange}
              max="999999999999999" // Max value for up to 15 digits
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="departure_city" className="form-label">
              Departure City<span style={{ color: "red" }}>*</span>:
            </label>
            <input
              type="text"
              className="form-control border-dark"
              id="departure_city"
              name="departure_city"
              value={formData.departure_city}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="arrival_city" className="form-label">
              Arrival City<span style={{ color: "red" }}>*</span>:
            </label>
            <input
              type="text"
              className="form-control border-dark"
              id="arrival_city"
              name="arrival_city"
              value={formData.arrival_city}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="departure_datetime" className="form-label">
              Departure Datetime<span style={{ color: "red" }}>*</span>:
            </label>
            <input
              type="datetime-local"
              className="form-control border-dark"
              id="departure_datetime"
              name="departure_datetime"
              value={formData.departure_datetime}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="arrival_datetime" className="form-label">
              Arrival Datetime<span style={{ color: "red" }}>*</span>:
            </label>
            <input
              type="datetime-local"
              className="form-control border-dark"
              id="arrival_datetime"
              name="arrival_datetime"
              value={formData.arrival_datetime}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="booking_date" className="form-label">
              Booking Date<span style={{ color: "red" }}>*</span>:
            </label>
            <input
              type="date"
              className="form-control border-dark"
              id="booking_date"
              name="booking_date"
              value={formData.booking_date}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="num_travelers" className="form-label">
              Number of Travelers<span style={{ color: "red" }}>*</span>:
            </label>
            <input
              type="number"
              className="form-control border-dark"
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
              className="form-control border-dark"
              id="booking_company"
              name="booking_company"
              value={formData.booking_company}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="booking_type" className="form-label">
              Booking Type<span style={{ color: "red" }}>*</span>:
            </label>
            <select
              className="form-select border-dark"
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
              Total Price<span style={{ color: "red" }}>*</span>:
            </label>
            <input
              type="number"
              className="form-control border-dark"
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
              className="form-control border-dark"
              id="additional_info"
              name="additional_info"
              value={formData.additional_info}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>
        <div className="d-flex justify-content-evenly align-items-center">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
          <Link to="/user">
            <button className="btn btn-success">Go Back</button>
          </Link>
        </div>
      </form>
      <Toast
        show={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
        delay={3000}
        autohide
        style={{
          position: "fixed",
          bottom: "40px",
          right: "10px",
          minWidth: "300px",
          backgroundColor: "white",
          boxShadow: "0 2px 4px rgba(0,0,0,.1)",
          fontSize: 15,
        }}
      >
        <Toast.Body>Booking Details Added Successfully</Toast.Body>
      </Toast>
      <Toast
        show={showErrorToast}
        onClose={() => setShowErrorToast(false)}
        delay={3000}
        autohide
        style={{
          position: "fixed",
          bottom: "40px",
          right: "10px",
          minWidth: "300px",
          backgroundColor: "white",
          boxShadow: "0 2px 4px rgba(0,0,0,.1)",
          fontSize: 15,
        }}
      >
        <Toast.Body>Please fill in all required fields.</Toast.Body>
      </Toast>
    </div>
  );
};
