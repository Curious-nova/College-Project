import FlightIcon from "@mui/icons-material/Flight";
import HotelIcon from "@mui/icons-material/Hotel";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import HolidayVillageIcon from "@mui/icons-material/HolidayVillage";
import TrainIcon from "@mui/icons-material/Train";
import DirectionsBusFilledIcon from "@mui/icons-material/DirectionsBusFilled";
import LocalTaxiIcon from "@mui/icons-material/LocalTaxi";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import DownhillSkiingIcon from "@mui/icons-material/DownhillSkiing";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import {Icondivcss} from "./Icondivcss";
import { Link } from "react-router-dom";

export const Icondiv = () => {
  return (
    <Icondivcss>
      <div className="icondiv">
        <div>
          <Link to="/">
            <span>
              <FlightIcon style={{ fontSize: 40, padding: 4 }}></FlightIcon>
            </span>
            <p>Flights</p>
          </Link>
        </div>
        <div>
          <Link to="/hotel-search">
            <span>
              <HotelIcon style={{ fontSize: 40, padding: 4 }}></HotelIcon>
            </span>
            <p>Hotels</p>
          </Link>
        </div>
        <div>
          <Link to="/holiday-package-search">
            <span>
              <HolidayVillageIcon style={{ fontSize: 40, padding: 4 }}></HolidayVillageIcon>
            </span>
            <p>Holiday packages</p>
          </Link>
        </div>
        <div>
          <Link to="/train-search">
            <span>
              <TrainIcon style={{ fontSize: 40, padding: 4 }}></TrainIcon>
            </span>
            <p>Trains</p>
          </Link>
        </div>
        <div>
          <Link to="/bus-search">
            <span>
              <DirectionsBusFilledIcon style={{ fontSize: 40, padding: 4 }}></DirectionsBusFilledIcon>
            </span>
            <p>Buses</p>
          </Link>
        </div>
        <div>
          <Link to="/cab-search">
            <span>
              <LocalTaxiIcon style={{ fontSize: 40, padding: 4 }}></LocalTaxiIcon>
            </span>
            <p>Cabs</p>
          </Link>
        </div>
      </div>
    </Icondivcss>
  );
};
