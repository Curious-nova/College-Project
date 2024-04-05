import styled from "styled-components";
import { nanoid } from "nanoid";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Style = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 30px;
  padding: 20px;
`;

const FlightBox = styled.div`
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
  }
`;

const FlightDetails = styled.div`
  padding: 20px;
`;

const AirlineLogo = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
`;

const DetailsContent = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
`;

const FlightInfo = styled.div`
  flex: 1;
`;

const FlightPrice = styled.div`
  padding: 20px;
  background-color: #f0f0f0;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
`;

const Price = styled.p`
  margin: 0;
  font-size: 20px;
  font-weight: bold;
`;

const BookButton = styled.button`
  padding: 12px 24px;
  background-color: #662d91;
  color: #ffffff;
  border: none;
  border-radius: 30px;
  font-size: 16px;
  font-color: #f0f8ff;
  cursor: pointer;
  transition: background-color 0.8s ease;

  &:hover {
    background-color: #800080;
  }
 
`;

const Loader = styled.div`
  text-align: center;
`;

export const Bottom = ({ data, bookData }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (data && data.flightOffers) {
      setLoading(false);
    }
  }, [data]);

  const handleBookNow = (flightData) => {
    bookData(flightData);
  };

  const formatDate = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  };

  return (
    <>
      {loading && (
        <Loader>
          <div
            className="d-flex justify-content-center"
            style={{ marginTop: "180px", marginBottom: "20px" }}
          >
            <div
              className="spinner-border spinner-border-lg"
              role="status"
            ></div>
          </div>
          <div>
            <span className="sr-only">Searching for Flights ...</span>
          </div>
        </Loader>
      )}
      {!loading && (
        <Style>
          {data?.flightOffers?.map((flightOffer) => (
            <FlightBox key={nanoid(6)}>
              <FlightDetails>
                <DetailsContent>
                  <AirlineLogo
                    src={flightOffer.segments[0].legs[0].carriersData[0].logo}
                    alt={flightOffer.segments[0].legs[0].carriersData[0].name}
                  />
                  <FlightInfo>
                    <p>
                      <strong>Departure:</strong>{" "}
                      {formatDate(flightOffer.segments[0].departureTime)} IST
                    </p>
                    <p>
                      <strong>Arrival:</strong>{" "}
                      {formatDate(flightOffer.segments[0].arrivalTime)} IST
                    </p>
                    <p>
                      <strong>Airline:</strong>{" "}
                      {flightOffer.segments[0].legs[0].carriersData[0].name}
                    </p>
                  </FlightInfo>
                </DetailsContent>
              </FlightDetails>
              <FlightPrice>
                <Price>
                  Price: {flightOffer.priceBreakdown.total.units}{" "}
                  {flightOffer.priceBreakdown.total.currencyCode}
                </Price>
                <BookButton onClick={() => handleBookNow(flightOffer)}>
                  <Link
                    to="/checkout"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Book Now
                  </Link>
                </BookButton>
              </FlightPrice>
            </FlightBox>
          ))}
        </Style>
      )}
    </>
  );
};