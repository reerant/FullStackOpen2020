import React from "react";

//info for filtered country
const Info = ({ country }) => {
  return (
    <div>
      <h1>{country.name}</h1> <p>Capital: {country.capital}</p>
      <p>Population: {country.population}</p>
      <h2>Languages: </h2>
      <ul>
        {country.languages.map((language) => (
          <li key={language.name}>{language.name}</li>
        ))}
      </ul>
      <br></br>
      <img src={country.flag} alt="Country flag" width="180" height="100"></img>
    </div>
  );
};

export default Info;
