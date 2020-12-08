import React from "react"
import Notification from "./Notification"
import PropTypes from "prop-types"

const LoginForm = ({
  username,
  password,
  handleLogin,
  setUsername,
  setPassword,
  error,
}) => (
  <div>
    <h2>Log in to application</h2>
    {/* show error msg if username or password is wrong */}
    <Notification error={error} />
    <form id="loginForm" onSubmit={handleLogin}>
      <div>
        Username
        <input
          id="username"
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        Password
        <input
          id="password"
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button id="submitLoginBtn" type="submit">Login</button>
    </form>
  </div>
)

LoginForm.propTypes = {
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  handleLogin: PropTypes.func.isRequired,
  setUsername: PropTypes.func.isRequired,
  setPassword: PropTypes.func.isRequired,
  error: PropTypes.string,
}

export default LoginForm
