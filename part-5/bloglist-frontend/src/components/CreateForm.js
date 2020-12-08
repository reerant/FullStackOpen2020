import React, { useState } from "react"
import PropTypes from "prop-types"

const CreateForm = ({ createNew }) => {
  const [newTitle, setNewTitle] = useState("")
  const [newAuthor, setNewAuthor] = useState("")
  const [newUrl, setNewUrl] = useState("")

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }
  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }
  const handleUrlChange = (event) => {
    setNewUrl(event.target.value)
  }

  // create new blog post
  const addNewBlog = (event) => {
    event.preventDefault()
    createNew({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    })
    setNewTitle("")
    setNewAuthor("")
    setNewUrl("")
  }
  return (
    <div>
      <form id="createForm" onSubmit={addNewBlog}>
        <label>
          Title: <input id="title" value={newTitle} onChange={handleTitleChange} />
        </label>
        <br />
        <label>
          Author: <input id="author" value={newAuthor} onChange={handleAuthorChange} />
        </label>
        <br />
        <label>
          Url: <input id="url" value={newUrl} onChange={handleUrlChange} />
        </label>
        <br />
        <button id="createBtnSend" type="submit">Create</button>
      </form>
    </div>
  )
}

CreateForm.propTypes = {
  createNew: PropTypes.func.isRequired,
}

export default CreateForm
