import React, { useState, useEffect } from "react";
import AddForm from "./components/AddForm";
import Persons from "./components/Persons";
import Filter from "./components/Filter";
import Notification from "./components/Notification";
import phonebookService from "./services/phonebook";
import "./App.css";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);

  //show notification msg for 3 sec
  const msgTimeout = () => {
    setTimeout(() => {
      setMsg(null);
    }, 3000);
  };
  //show error msg for 5 sec
  const errorTimeout = () => {
    setTimeout(() => {
      setError(null);
    }, 5000);
  };

  //get persons data from json server
  useEffect(() => {
    phonebookService
      .getAll()
      .then((initialPersons) => {
        setPersons(initialPersons);
      })
      .catch((e) => {
        setError(`Request failure. Unable to fetch data from the server.`);
        errorTimeout();
      });
  }, []);

  //name input
  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  //number input
  const handleNumberChange = (e) => {
    setNewNumber(e.target.value);
  };

  //filter input
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  //check if list needs to be filtered or not
  const phonebookList =
    filter !== ""
      ? persons.filter(
          (p) =>
            p.name.toLowerCase().includes(filter.toLowerCase()) ||
            p.number.toLowerCase().includes(filter.toLowerCase())
        )
      : persons;

  //add new person to the phonebook
  const addNew = (e) => {
    e.preventDefault();
    const newPerson = {
      name: newName,
      number: newNumber,
    };
    //check if person already exists in the phonebook
    const existingPerson = persons.find(
      (p) => p.name.toLowerCase() === newName.toLowerCase()
    );
    if (existingPerson) {
      if (
        window.confirm(
          `${newName} is already added to the Phonebook. Do you want to replace the old number with a new one?`
        )
      ) {
        //update the number for existing person
        phonebookService
          .update(existingPerson.id, newPerson)
          .then((changedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id !== existingPerson.id ? person : changedPerson
              )
            );
            setMsg(`Updated number for ${existingPerson.name}: ${newNumber} `);
            msgTimeout();
          })
          .catch((e) => {
            setError(
              `Unable to update. ${existingPerson.name} is already deleted from the Phonebook.`
            );
            errorTimeout();
            setPersons(persons.filter((p) => p.id !== existingPerson.id));
          });
      }
    } else {
      //add new person to the phonebook
      phonebookService
        .create(newPerson)
        .then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson));
          setMsg(`Added ${returnedPerson.name} to the Phonebook.`);
          msgTimeout();
        })
        .catch((e) => {
          setError(
            `Request failure. Unable to add new person to the Phonebook.`
          );
          errorTimeout();
        });
    }
    setNewName("");
    setNewNumber("");
  };

  //delete person from the phonebook
  const deletePerson = (person) => {
    if (window.confirm(`Do you want to delete: ${person.name}`)) {
      phonebookService
        .remove(person.id)
        .then(() => {
          setPersons(persons.filter((p) => p.id !== person.id));
          setMsg(`Deleted ${person.name} from the Phonebook.`);
          msgTimeout();
        })
        .catch((e) => {
          setError(`${person.name} is already deleted from the Phonebook.`);
          errorTimeout();
          setPersons(persons.filter((p) => p.id !== person.id));
        });
    }
  };

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification msg={msg} error={error} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h2>Add a New</h2>
      <AddForm
        addNew={addNew}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons phonebookList={phonebookList} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
