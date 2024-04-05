import { useState, useEffect } from "react";
import axios from 'axios';
import { Header } from "./Header";
import { Bottom } from "./Bottom";
import { SearchBox } from "./SearchBox";


export const Search = () => {
  const [dataa, setData] = useState([]);
  const [departureDate, setDepartureDate] = useState("");
  const [travelClass, setTravelClass] = useState("");
  const [searchParams, setSearchParams] = useState({
    from: "",
    to: "",
    departureDate: "",
    travelClass: "" // Added travelClass to the state
  });

  const handleChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value,
    });
  };
  

  const handleSearch = async () => {
    try {
      setDepartureDate(searchParams.departureDate); // Update departure date
      setTravelClass(searchParams.travelClass);
      const flightData = await searchFlights(searchParams);
      setData(flightData.data);
    
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const bookData = (data) => {
    localStorage.setItem("buy", JSON.stringify(data));
  };


  const searchFlights = async ({ from, to, departureDate, travelClass}) => {
    const options = {
      method: 'GET',
      // url: 'https://booking-com15.p.rapidapi.com/api/v1/flights/searchFlights',
      params: {
        fromId: from,
        toId: to,
        departDate: departureDate,
        adults: '1',
        sort: 'CHEAPEST',
        cabinClass: travelClass,
        currency_code: 'INR'
      },
      headers: {
        'X-RapidAPI-Key': '8b215e6521mshd9f4d8a43ea552fp196c0djsnddb4f9fb3d3f',
        'X-RapidAPI-Host': 'booking-com15.p.rapidapi.com'
      }
    };
    
    const response = await axios.request(options);
    return response.data;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = localStorage.getItem("myKey");
        if (!storedData) {
          throw new Error("No data found in localStorage");
        }
        const { from, to, departureDate, travelClass } = JSON.parse(storedData);
        const flightData = await searchFlights({ from, to, departureDate, travelClass });
        setData(flightData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    return () => {
      // Clean-up function to handle component unmount
    };

  }, []);

  return (
    <>
      <Header />
      <SearchBox handle={handleSearch} />
      <Bottom data={dataa} bookData={bookData} />
    </>
  );
};
