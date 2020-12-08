import React, { useState } from "react"
import blogService from "../services/blogs"
import PropTypes from "prop-types"

const Blog = ({ blog, addLike, blogDeleted, canDelete }) => {
  const [viewMore, setViewMore] = useState(false)

  //inline styles
  const blogStyle = {
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
    marginTop: 5,
  }
  const buttonStyle = {
    marginLeft: 5,
  }
  const deleteButtonStyle = {
    marginLeft: 5,
    backgroundColor: "red",
  }

  //manage visibility for blog posts -> view more or hide
  const toggleVisibility = () => {
    setViewMore(!viewMore)
  }

  //delete blog post
  const deleteBlog = async (event) => {
    event.preventDefault()
    if (
      window.confirm(
        `Do you want to delete post: ${blog.title} by ${blog.author}`
      )
    ) {
      await blogService.remove(blog.id)
      blogDeleted(blog.id)
    }
  }

  return (
    <div className="blogPost">
      {/* this div is hidden when user clicks "view more" */}
      <div hidden={viewMore} style={blogStyle} className="smallView">
        <b>Blog: </b>
        {blog.title}, <b>Author:</b> {blog.author}
        <button id="viewMoreBtn" onClick={toggleVisibility} style={buttonStyle}>
          View more
        </button>
      </div>
      {/* this div is hidden by default or when user clicks "hide" */}
      <div hidden={!viewMore} style={blogStyle} className="viewMore">
        <b>Blog: </b> {blog.title}
        <button id="hide" onClick={toggleVisibility} style={buttonStyle}>
          Hide
        </button>
        <br></br>
        <b>Author: </b>
        {blog.author}
        <br></br>
        <b>Url: </b>
        {blog.url}
        <br></br>
        <b>Likes: </b>
        {blog.likes}
        <button id="likeBtn" onClick={() => addLike(blog)} style={buttonStyle}>
          Like
        </button>
        <br></br>
        <b>User: </b>
        {blog.user.name}
        <br></br>
        {/* delete shows only if the logged in user is the same one who has created the post*/}
        <button
          id="deleteBtn"
          hidden={!canDelete}
          onClick={deleteBlog}
          style={deleteButtonStyle}
        >
          Delete
        </button>
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  addLike: PropTypes.func.isRequired,
  blogDeleted: PropTypes.func.isRequired,
  canDelete: PropTypes.bool.isRequired,
}
export default Blog
