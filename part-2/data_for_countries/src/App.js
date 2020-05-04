import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import Filter from "./components/Filter";
import ShowFiltered from "./components/ShowFiltered";

function App() {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("");

  //get country data from API
  useEffect(() => {
    axios.get("https://restcountries.eu/rest/v2/all").then((response) => {
      const data = response.data;
      setCountries(data);
    });
  }, []);

  //filter input
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  //filter countries by user input
  const filteredCountries =
    filter !== ""
      ? countries.filter((c) =>
          c.name.toLowerCase().includes(filter.toLowerCase())
        )
      : [];

  //set to filter the name of the country which button gets clicked
  const showInfo = (countryName) => {
    setFilter(countryName);
  };

  return (
    <div className="App">
      <div>
        <Filter filter={filter} handleFilterChange={handleFilterChange} />
      </div>
      <div>
        <ShowFiltered
          filteredCountries={filteredCountries}
          showInfo={showInfo}
        />
      </div>
    </div>
  );
}

export default App;
