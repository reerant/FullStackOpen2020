import React from "react"
import PropTypes from "prop-types"

const Notification = ({ msg, error }) => {
  if (!msg && !error) {
    return null
  }
  if (msg) {
    return <div className="msg">{msg}</div>
  } else {
    return <div className="error">{error}</div>
  }
}
Notification.propTypes = {
  msg: PropTypes.string,
  error: PropTypes.string,
}

export default Notification
