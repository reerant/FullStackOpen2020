import React, { useState } from "react";
import ReactDOM from "react-dom";

//render header
const Header = ({ header }) => <h1>{header}</h1>;

//render random anecdote
const RandomAnecdote = ({ anecdote, votes }) => {
  return (
    <>
      <div>{anecdote}</div>
      <div>Has {votes} votes.</div>
    </>
  );
};

//render most popular anecdote by votes
const MostPopularAnecdote = ({ anecdote }) => {
  if (anecdote.votes === 0) {
    return <div>No votes yet.</div>;
  } else {
    return (
      <>
        <div>{anecdote.anecdote}</div>
        <div>Has {anecdote.votes} votes.</div>
      </>
    );
  }
};

//render button
const Button = ({ onClick, btnText }) => (
  <button onClick={onClick}>{btnText}</button>
);

//render the app
const App = ({ anecdotes }) => {
  //get random number from 0 to anecdotes.length -1
  const getRandomAnecdoteIndex = () => {
    return Math.floor(Math.random() * anecdotes.length);
  };

  const [selected, setSelected] = useState(getRandomAnecdoteIndex());
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0));
  const header1 = "Anecdote of the Day";
  const header2 = "Anecdote with the Most Votes";

  //set new random anecdote to state
  const setRandomAnecdote = () => {
    const randomAnecdote = getRandomAnecdoteIndex();
    setSelected(randomAnecdote);
  };

  //vote for anecdote
  const voteAnecdote = () => {
    const copyOfVotes = [...votes];
    copyOfVotes[selected] += 1;
    setVotes(copyOfVotes);
  };

  //get anecdote with the biggest amount of votes --> show only first if multiple with the same amount of votes
  const getMostPopular = () => {
    const biggestNumber = Math.max(...votes);
    const index = votes.indexOf(biggestNumber);
    const text = anecdotes[index];
    return { anecdote: text, votes: biggestNumber };
   
  };

  return (
    <>
      <Header header={header1} />
      <RandomAnecdote anecdote={anecdotes[selected]} votes={votes[selected]} />
      <Button onClick={voteAnecdote} btnText="Vote" />
      <Button onClick={setRandomAnecdote} btnText="Next Anecdote" />
      <Header header={header2} />
      <MostPopularAnecdote anecdote={getMostPopular()} />
    </>
  );
};

const anecdotes = [
  "If it hurts, do it more often",
  "Adding manpower to a late software project makes it later!",
  "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
  "Premature optimization is the root of all evil.",
  "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it."
];

ReactDOM.render(<App anecdotes={anecdotes} />, document.getElementById("root"));
