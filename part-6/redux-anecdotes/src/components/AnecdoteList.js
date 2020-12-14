import React from "react";
import { addVote } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer";
import { connect } from "react-redux";

const AnecdoteList = (props) => {
  
  const vote = (anecdote) => {
    props.addVote(anecdote);
    props.setNotification(`you voted for: '${anecdote.content}'`, 5000);
  };

  return (
    <div>
      {props.anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

const mapStateToProps = (state) => {
  //sort anecdotes by the amount of votes from highest to lowest
  let anecdotes;
  const sortedAnecdotes = state.anecdotes.sort((a, b) => {
    return b.votes - a.votes;
  });
  // filter anecdotes
  if (state.filter)
    anecdotes = sortedAnecdotes.filter((a) => a.content.includes(state.filter));
  else anecdotes = sortedAnecdotes;
  return {
    anecdotes,
  };
};

const mapDispatchToProps = {
  addVote,
  setNotification,
};

export default connect(mapStateToProps, mapDispatchToProps)(AnecdoteList);
