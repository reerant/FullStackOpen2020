import React, { useState, useEffect } from "react";
import axios from "axios";
import Info from "./Info";
import Weather from "./Weather";

const Country = ({ country }) => {
  const api_key = process.env.REACT_APP_API_KEY;
  const [weather, setWeather] = useState(null);

  //get weather info from API
  useEffect(() => {
    axios
      .get(
        "http://api.weatherstack.com/current?access_key=" +
          api_key +
          "&query=" +
          country.capital
      )
      .then((response) => {
        setWeather(response.data);
      });
  }, [api_key, country.capital]);

  return (
    <>
      <Info country={country} />
      <Weather capital={country.capital} weather={weather} />
    </>
  );
};

export default Country;
