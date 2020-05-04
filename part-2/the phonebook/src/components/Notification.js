import React from "react";

const Notification = ({ msg, error }) => {
  if (msg === null && error === null) {
    return null;
  }
  if (msg) {
    return <div className="msg">{msg}</div>;
  } else {
    return <div className="error">{error}</div>;
  }
};

export default Notification;
