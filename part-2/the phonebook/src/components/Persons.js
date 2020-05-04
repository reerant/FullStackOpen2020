import React from "react";
import Person from "./Person";

const Persons = ({ phonebookList, deletePerson }) => {
  return (
    <table>
      {phonebookList.map((person) => (
        <Person
          key={person.id}
          person={person}
          deletePerson={() => deletePerson(person)}
        />
      ))}
    </table>
  );
};

export default Persons;
