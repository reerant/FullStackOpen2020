import React, { useState } from "react";
import ReactDOM from "react-dom";

//render header
const Header = ({ header }) => <h1>{header}</h1>;

//render button
const Button = ({ onClick, btnText }) => {
  return <button onClick={onClick}>{btnText}</button>;
};

//render statisticline
const StatisticLine = ({ text, value }) => {
  return (
    <tbody>
      <tr>
        <td>{text} </td>
        <td>{value}</td>
      </tr>
    </tbody>
  );
};

//render statistics
const Statistics = ({ good, neutral, bad, all, avg, positive }) => {
  // no feedbacks yet
  if (all === 0) {
    return (
      <div>
        <p>No feedback given.</p>
      </div>
    );
  }
  //feedbacks are given
  return (
    <table>
      <StatisticLine text="Good" value={good} />
      <StatisticLine text="Neutral" value={neutral} />
      <StatisticLine text="Bad" value={bad} />
      <StatisticLine text="All" value={all} />
      <StatisticLine text="Average" value={avg} />
      <StatisticLine text="Positive" value={positive + "%"} />
    </table>
  );
};

//render the app
const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [all, setAll] = useState(0);
  const [values, setValue] = useState([]);
  const header1 = "Give Feedback";
  const header2 = "Statistics";

  //good button
  const handleClickGood = () => {
    setGood(good + 1);
    setAll(all + 1);
    setValue(values.concat(1));
  };

  //neutral button
  const handleClickNeutral = () => {
    setNeutral(neutral + 1);
    setAll(all + 1);
    setValue(values.concat(0));
  };

  //bad button
  const handleClickBad = () => {
    setBad(bad + 1);
    setAll(all + 1);
    setValue(values.concat(-1));
  };

  //calculate how many percent of the feedbacks have been positive
  const getPositive = () => (good === 0 ? 0 : (good / all) * 100);

  //calculate the average of given values -> good=1, neutral=0, bad=-1
  const getAvg = () =>
    values.length === 0 ? 0 : values.reduce((accumulator, currentValue) => accumulator + currentValue, 0) / values.length;

  return (
    <div>
      <Header header={header1} />
      <Button onClick={handleClickGood} btnText="Good" />
      <Button onClick={handleClickNeutral} btnText="Neutral" />
      <Button onClick={handleClickBad} btnText="Bad" />
      <Header header={header2} />
      <Statistics
        good={good}
        neutral={neutral}
        bad={bad}
        all={all}
        avg={getAvg()}
        positive={getPositive()}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
