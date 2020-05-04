import React from "react";
import CountryLine from "./CountryLine";
import Country from "./Country";

const ShowFiltered = ({ filteredCountries, showInfo }) => {
  //different filter scenarios
  if (filteredCountries.length > 10) {
    return "Too many matches, please specify another filter.";
  } else if (filteredCountries.length > 1) {
    return (
      <table>
        {filteredCountries.map((country) => (
          <CountryLine
            key={country.name}
            name={country.name}
            showInfo={showInfo}
          />
        ))}
      </table>
    );
  } else {
    return filteredCountries.map((country) => (
      <Country key={country.name} country={country} />
    ));
  }
};
export default ShowFiltered;
