import React from "react";

const Filter = ({ filter, handleFilterChange }) => {
  return (
    <div>
      <strong>Find Countries </strong>
      <input id="filter" value={filter} onChange={handleFilterChange}></input>
    </div>
  );
};

export default Filter;
