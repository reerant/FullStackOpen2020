import React from "react";

const Person = ({ person, deletePerson }) => {
  return (
    <tbody>
      <tr>
        <td>
          {person.name} {person.number}
        </td>
        <td>
          <button onClick={deletePerson}>Delete</button>
        </td>
      </tr>
    </tbody>
  );
};

export default Person;
