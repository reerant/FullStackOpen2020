import React from "react";

//page header
const Header = ({ name }) => <h2>{name}</h2>;

//name and exercise info
const Part = ({ name, exercises }) => (
  <p>
    {name} {exercises}
  </p>
);

//course's content parts
const Content = ({ parts }) => {
  return (
    <div>
      {parts.map((part) => (
        <Part key={part.id} name={part.name} exercises={part.exercises} />
      ))}
    </div>
  );
};

//total amount of exercises
const Total = ({ parts }) => {
  let totalOfExercises = parts.reduce((sum, part) => sum + part.exercises, 0);
  return (
    <p>
      <strong>Total of exercises {totalOfExercises}</strong>
    </p>
  );
};

//course info
const Course = ({ course }) => {
  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
};

export default Course;
