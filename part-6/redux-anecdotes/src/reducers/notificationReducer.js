const notificationReducer = (state = null, action) => {
  switch (action.type) {
    case "SET_NOTIFICATION":
      return action.content;
    case "HIDE_NOTIFICATION":
      return null;
    default:
      return state;
  }
};

let timeout;

export const setNotification = (content, time) => {
  return (dispatch) => {
    dispatch({
      type: "SET_NOTIFICATION",
      content,
    });
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      dispatch({ type: "HIDE_NOTIFICATION" });
    }, time);
  };
};

export default notificationReducer;
