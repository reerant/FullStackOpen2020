import React from "react";

const CountryLine = ({ name, showInfo }) => {
  return (
    <tbody>
      <tr>
        <td>{name}</td>
        <td>
          {/* click to show the country info */}
          <button onClick={() => showInfo(name)}>Show</button>
        </td>
      </tr>
    </tbody>
  );
};

export default CountryLine;
