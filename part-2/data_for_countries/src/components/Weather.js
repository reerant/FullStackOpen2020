import React from "react";

//weather info for filtered country's capital
const Weather = ({ capital, weather }) => {
  return (
    <div>
      <h2>Weather in {capital}</h2>
      <p>Temperature: {weather ? weather.current.temperature : ""} Celcius</p>
      <img
        src={weather ? weather.current.weather_icons : ""}
        alt="weather icon"
        width="100"
        height="100"
      ></img>
      <p>
        Wind: {weather ? weather.current.wind_speed : ""} kmph, direction{" "}
        {weather ? weather.current.wind_dir : ""}
      </p>
    </div>
  );
};

export default Weather;
