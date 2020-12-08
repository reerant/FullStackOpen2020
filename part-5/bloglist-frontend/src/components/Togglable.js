import React, { useState, useImperativeHandle } from "react"

const Togglable = React.forwardRef((props, ref) => {
  const [showCreateForm, setShowCreateForm] = useState(false)

  const toggleVisibility = () => {
    setShowCreateForm(!showCreateForm)
  }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility,
    }
  })

  return (
    <div>
      {/*this div is hidden when user clicks "create new blog"  */}
      <div hidden={showCreateForm}>
        <button id="createNewBtn" onClick={toggleVisibility}>Create new blog</button>
      </div>
      {/*this div is hidden by default or when user clicks "cancel"  */}
      <div hidden={!showCreateForm}>
        <p>CREATE NEW BLOG</p>
        {props.children}
        <button onClick={toggleVisibility}>Cancel</button>
      </div>
    </div>
  )
})

Togglable.displayName = "Togglable"

export default Togglable
