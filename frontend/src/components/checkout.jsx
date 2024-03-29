import React, { useState, useEffect } from "react";
import styled from "styled-components";
import bmtLogo from './bmt_logo.jpg';
import { Link } from "react-router-dom";

// Styled components
const CheckoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px;
  background: linear-gradient(to right, #8f92fa 0%, #6165f0 25%, #6c70eb 50%, #3339e9 100%);
  min-height: 100vh;
`;

const Title = styled.h2`
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 40px;
  color: #fff;
`;

const SectionContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin-bottom: 40px;
  padding: 30px;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
`;

const Subtitle = styled.h3`
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
`;

const Input = styled.input`
  width: 93%;
  padding: 15px 20px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  color: #555;
`;

const AddButton = styled.button`
  width: 100%;
  padding: 15px 20px;
  background-color: #1d56ff;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #024677;
  }
`;

const CancelButton = styled(AddButton)`
  background-color: #dc3545;

  &:hover {
    background-color: #d00e22;
  }
`;

const CheckoutButton = styled(AddButton)`
  background-color: #10942f;
  width: 120%;

  &:hover {
    background-color: #007008;
  }
`;

const CompanyNameLogo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #fff;
`;

const CompanyLogo = styled.img`
  width: 100px;
  height: auto;
  margin-right: 20px;
`;

const CompanyName = styled.h1`
  font-size: 36px;
  font-weight: bold;
  color: #fff;
  margin: 0;
`;

const Select = styled.select`
  width: 100%;
  padding: 15px 20px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  color: #555;
`;

export const Checkout = () => {
  const storedFlight = localStorage.getItem("buy");
  const selectedFlight = storedFlight ? JSON.parse(storedFlight) : null;
  const [totalPrice, setTotalPrice] = useState(0);
  const [travellerDetails, setTravellerDetails] = useState(() => {
    const storedTravellers = localStorage.getItem("travellers");
    return storedTravellers ? JSON.parse(storedTravellers) : [{ name: "", age: "", gender: "" }];
  });

  useEffect(() => {
    const pricePerTravel = selectedFlight?.priceBreakdown.total.units || 0;
    const totalPrice = pricePerTravel * travellerDetails.length;
    setTotalPrice(totalPrice);
  }, [selectedFlight, travellerDetails]);

  useEffect(() => {
    localStorage.setItem("travellers", JSON.stringify(travellerDetails));
  }, [travellerDetails]);

  const handleAddTraveller = () => {
    setTravellerDetails([...travellerDetails, { name: "", age: "", gender: "" }]);
  };

  const handleCancelTraveller = (index) => {
    const updatedTravellers = [...travellerDetails];
    updatedTravellers.splice(index, 1);
    setTravellerDetails(updatedTravellers);
  };

  const handleInputChange = (index, field, value) => {
    const updatedTravellers = [...travellerDetails];
    updatedTravellers[index][field] = value;
    setTravellerDetails(updatedTravellers);
  };

  const formatDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    const formattedDate = dateTime.toLocaleDateString();
    const formattedTime = dateTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return `${formattedDate} ${formattedTime} IST`;
  };

  return (
    <CheckoutContainer>
      <CompanyNameLogo>
        <CompanyLogo src={bmtLogo} alt="Company Logo" />
        <CompanyName>BookMyTrip</CompanyName>
      </CompanyNameLogo>
      <Title>Secure Checkout</Title>
      <SectionContainer>
        <Subtitle>Flight Details</Subtitle>
        <Input disabled value={`Departure: ${formatDateTime(selectedFlight?.segments[0]?.departureTime)}`} />
        <Input disabled value={`Arrival: ${formatDateTime(selectedFlight?.segments[0]?.arrivalTime)}`} />
        <Input disabled value={`Airline: ${selectedFlight?.segments[0]?.legs[0]?.carriersData[0]?.name}`} />
        <Input disabled value={`Price: ${selectedFlight?.priceBreakdown.total.units} INR`} />
      </SectionContainer>
      <SectionContainer>
        <Subtitle>Traveller Details</Subtitle>
        {travellerDetails.map((traveller, index) => (
          <div key={index}>
            <Input
              value={traveller.name}
              onChange={(e) => handleInputChange(index, 'name', e.target.value)}
              placeholder="Name"
            />
            <Input
              value={traveller.age}
              onChange={(e) => handleInputChange(index, 'age', e.target.value)}
              placeholder="Age"
            />
            <Select
              value={traveller.gender}
              onChange={(e) => handleInputChange(index, 'gender', e.target.value)}
              placeholder="Gender"
            >
              <option defaultChecked disabled value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </Select>
            <CancelButton onClick={() => handleCancelTraveller(index)}>Cancel</CancelButton>
          </div>
        ))}
        <AddButton onClick={handleAddTraveller}>Add Traveller</AddButton>
      </SectionContainer>
      <SectionContainer>
        <Subtitle>Total Price</Subtitle>
        <Input disabled value={`Total Price: ${totalPrice} INR`} />
      </SectionContainer>
      {/* Use Link to pass state as URL parameters */}
      <Link
        to={{
          pathname: "/payment",
          search: `?totalPrice=${totalPrice}&numberOfTravellers=${travellerDetails.length}`
        }} style={{ textDecoration: 'none', color: 'inherit' }}>
      <CheckoutButton>
        Proceed to Payment
      </CheckoutButton>
      </Link>

    </CheckoutContainer>
  );
};
