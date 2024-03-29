import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import bmtLogo from "./bmt_logo.jpg";
import { Link, useLocation } from "react-router-dom";
import paymentdone from "./payment_done_image.png";
import paymentdonesound from "./payment_complete_sound.mp3";
const PaymentContainer = styled.div`
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

const Text = styled.p`
  font-size: 18px;
  margin-bottom: 20px;
  color: #555;
`;

const Button = styled.button`
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

const PaymentDoneContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
  background-color: #fff;
  border-radius: 10px;
  padding: 40px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
`;

const PaymentDoneImage = styled.img`
  width: 120px;
  height: auto;
  margin-bottom: 20px;
`;

const PaymentDoneText = styled.h3`
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
`;

const AdditionalText = styled.p`
  font-size: 18px;
  color: #555;
  text-align: center;
`;

const spinAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const ProcessingIcon = styled.div`
  border: 8px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 8px solid #fff;
  width: 50px;
  height: 50px;
  animation: ${spinAnimation} 1s linear infinite;
`;

export const PaymentPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const totalPrice = searchParams.get("totalPrice");
  const numberOfTravellers = searchParams.get("numberOfTravellers");

  const [loading, setLoading] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const handlePayment = () => {
    setLoading(true);
    console.log("Payment started...");
    // Dummy payment process, can be replaced with actual payment gateway integration
    setTimeout(() => {
      setLoading(false);
      setPaymentCompleted(true);
      console.log("Payment completed!");
    }, 3000); // Simulating a 3-second payment process
  };
  

  useEffect(() => {
    if (!loading && paymentCompleted) {
      // Play sound effect upon completion of payment process
      const audio = new Audio(paymentdonesound);
      audio.play();
      console.log("Sound played!");
    }
  }, [loading, paymentCompleted]);
  
  return (
    <PaymentContainer>
      <CompanyNameLogo>
        <CompanyLogo src={bmtLogo} alt="Company Logo" />
        <CompanyName>BookMyTrip</CompanyName>
      </CompanyNameLogo>
      <Title>Complete Your Payment</Title>
      <SectionContainer>
        <Subtitle>Total Price for Payment</Subtitle>
        <Text>Total Price: {totalPrice} INR</Text>
        <Subtitle>Number of Travellers</Subtitle>
        <Text>Total Travellers: {numberOfTravellers}</Text>
      </SectionContainer>
      {loading ? (
        <SectionContainer>
          <Subtitle>Processing Payment</Subtitle>
          <ProcessingIcon />
        </SectionContainer>
      ) : (
        <>
          {paymentCompleted ? (
            <PaymentDoneContainer>
              <PaymentDoneImage src={paymentdone} alt="Payment Done" />
              <PaymentDoneText>Payment Successful!</PaymentDoneText>
              <AdditionalText>Your booking is confirmed. Thank you for choosing BookMyTrip.</AdditionalText>
            </PaymentDoneContainer>
          ) : (
            <Button onClick={handlePayment}>Complete Payment</Button>
          )}
        </>
      )}
      <Link to="/" style={{ textDecoration: "none", color: "inherit", marginTop: "20px" }}>
        Back to Home
      </Link>
    </PaymentContainer>
  );
};