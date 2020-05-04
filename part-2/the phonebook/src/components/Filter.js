import React from "react";

const Filter = ({ filter, handleFilterChange }) => {
  return (
    <div>
      Filter by name or number{" "}
      <input value={filter} onChange={handleFilterChange}></input>
    </div>
  );
};

export default Filter;
