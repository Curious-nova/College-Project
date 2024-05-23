import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoMdHome } from "react-icons/io";
import { Link } from "react-router-dom";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";

export const DisplayAddedBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [formData, setFormData] = useState({
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
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const [trackIdToDelete, setTrackIdToDelete] = useState(null); // Add state to store track_id

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    axios
      .get(`http://localhost:8080/third-party-bookings/${userId}`)
      .then((res) => {
        setBookings(res.data);
      })
      .catch((err) => {
        console.error("Error fetching third party bookings:", err);
      });
  }, []);

  // Function to format date time to IST
  const formatDateTimeToIST = (dateTimeString) => {
    const options = {
      timeZone: "Asia/Kolkata",
      hour12: true,
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return new Date(dateTimeString).toLocaleString("en-IN", options);
  };

  const handleDeleteClick = (ticketId, trackId) => {
    setTicketToDelete(ticketId);
    setTrackIdToDelete(trackId); // Set track_id to be used in delete API
    setShowConfirmation(true);
  };

  const handleDeleteConfirmation = () => {
    const userId = localStorage.getItem("userId");

    // Check if the ticketToDelete state is null (no ticket selected)
    if (!ticketToDelete) {
      alert("No booking selected for deletion.");
      setShowConfirmation(false);
      return;
    }

    // If a ticket is selected for deletion, proceed with the deletion
    axios
      .delete(`http://localhost:8080/deleteBooking/${ticketToDelete}?track_id=${trackIdToDelete}&userId=${userId}`)
      .then((res) => {
        setBookings(bookings.filter(booking => booking.ticket_id !== ticketToDelete));
        setShowConfirmation(false);
      })
      .catch((err) => {
        console.error("Error deleting booking:", err);
        setShowConfirmation(false);
      });
  };

  const handleEditClick = (booking) => {
    setCurrentBooking(booking);
    setFormData({
      ticket_id: booking.ticket_id,
      booking_date: formatBookingDateForInput(booking.booking_date),
      departure_city: booking.departure_city,
      arrival_city: booking.arrival_city,
      departure_datetime: formatDateForInput(booking.departure_datetime),
      arrival_datetime: formatDateForInput(booking.arrival_datetime),
      num_travelers: booking.num_travelers,
      booking_company: booking.booking_company,
      booking_type: booking.booking_type,
      total_price: booking.total_price,
      additional_info: booking.additional_info,
    });
    setShowEditModal(true);
  };

  const formatBookingDateForInput = (dateString) => {
    return dateString ? dateString.split('T')[0] : ''; // Extract date part
  };

  const formatDateForInput = (dateTimeString) => {
    return dateTimeString ? dateTimeString.slice(0, -5) : ''; // Remove milliseconds and time zone offset
  };

  const handleEditSave = () => {
    const userId = localStorage.getItem("userId");

    // Check if any of the required fields are empty
    const requiredFields = ['ticket_id', 'booking_date', 'departure_city', 'arrival_city', 'departure_datetime', 'arrival_datetime', 'num_travelers', 'booking_type', 'total_price'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    // If all required fields are filled, proceed with saving the changes
    axios
      .put(`http://localhost:8080/updateBooking/${currentBooking.ticket_id}?track_id=${currentBooking.track_id}&userId=${userId}`, formData)
      .then((res) => {
        setBookings(bookings.map(booking =>
          booking.ticket_id === currentBooking.ticket_id ? { ...booking, ...formData } : booking
        ));
        setShowEditModal(false);
      })
      .catch((err) => {
        console.error("Error updating booking:", err);
        setShowEditModal(false);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mt-3 text-primary">
        <h2>Added Bookings</h2>
        <Link to="/">
          <button
            className="btn"
            style={{ backgroundColor: "#5783db", color: "white" }}
          >
            <span>
              <IoMdHome />
            </span>
          </button>
        </Link>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th style={{ color: "purple" }}>Ticket Id</th>
            <th style={{ color: "purple" }}>Booking Date</th>
            <th style={{ color: "purple" }}>Departure City</th>
            <th style={{ color: "purple" }}>Arrival City</th>
            <th style={{ color: "purple" }}>Departure Datetime</th>
            <th style={{ color: "purple" }}>Arrival Datetime</th>
            <th style={{ color: "purple" }}>Number of Travelers</th>
            <th style={{ color: "purple" }}>Booking Company</th>
            <th style={{ color: "purple" }}>Booking Type</th>
            <th style={{ color: "purple" }}>Total Price</th>
            <th style={{ color: "purple" }}>Additional Info</th>
            <th style={{ color: "purple" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.register_id}>
              <td>{booking.ticket_id}</td>
              <td>{booking.booking_date ? new Date(booking.booking_date).toLocaleDateString("en-IN") : "-"}</td>
              <td>{booking.departure_city}</td>
              <td>{booking.arrival_city}</td>
              <td>{formatDateTimeToIST(booking.departure_datetime)}</td>
              <td>{formatDateTimeToIST(booking.arrival_datetime)}</td>
              <td>{booking.num_travelers}</td>
              <td>{booking.booking_company || "-"}</td>
              <td>{booking.booking_type}</td>
              <td>{booking.total_price}</td>
              <td>{booking.additional_info || "-"}</td>
              <td>
                <button className="btn btn-warning me-1 mb-2" onClick={() => handleEditClick(booking)}>
                  <FaEdit />
                </button>
                <button className="btn btn-danger" onClick={() => handleDeleteClick(booking.ticket_id, booking.track_id)}>
                  <FaTrashAlt />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label>Booking Date <span style={{ color: "red" }}>*</span></label>
              <input
                type="date"
                className="form-control"
                name="booking_date"
                value={formData.booking_date}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Departure City <span style={{ color: "red" }}>*</span></label>
              <input
                type="text"
                className="form-control"
                name="departure_city"
                value={formData.departure_city}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Arrival City <span style={{ color: "red" }}>*</span></label>
              <input
                type="text"
                className="form-control"
                name="arrival_city"
                value={formData.arrival_city}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Departure Datetime <span style={{ color: "red" }}>*</span></label>
              <input
                type="datetime-local"
                className="form-control"
                name="departure_datetime"
                value={formData.departure_datetime}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Arrival Datetime <span style={{ color: "red" }}>*</span></label>
              <input
                type="datetime-local"
                className="form-control"
                name="arrival_datetime"
                value={formData.arrival_datetime}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Number of Travelers <span style={{ color: "red" }}>*</span></label>
              <input
                type="number"
                className="form-control"
                name="num_travelers"
                value={formData.num_travelers}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Booking Company</label>
              <input
                type="text"
                className="form-control"
                name="booking_company"
                value={formData.booking_company}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Booking Type <span style={{ color: "red" }}>*</span></label>
              <input
                type="text"
                className="form-control"
                name="booking_type"
                value={formData.booking_type}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Total Price <span style={{ color: "red" }}>*</span></label>
              <input
                type="number"
                className="form-control"
                name="total_price"
                value={formData.total_price}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Additional Info</label>
              <textarea
                className="form-control"
                name="additional_info"
                value={formData.additional_info}
                onChange={handleInputChange}
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showConfirmation} onHide={() => setShowConfirmation(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this booking?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmation(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirmation}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DisplayAddedBooking;
