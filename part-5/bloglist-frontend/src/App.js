import React, { useState, useEffect, useRef } from "react"
import Blog from "./components/Blog"
import LoginForm from "./components/LoginForm"
import CreateForm from "./components/CreateForm"
import Notification from "./components/Notification"
import Togglable from "./components/Togglable"
import blogService from "./services/blogs"
import loginService from "./services/login"
import "./App.css"

const App = () => {
  const [initialBlogs, setInitialBlogs] = useState([])
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)
  const [msg, setMsg] = useState(null)
  const [error, setError] = useState(null)
  const [sort, setSort] = useState(false)
  const createFormRef = useRef()

  useEffect(() => {
    const initBlogs = async () => {
      const blogs = await blogService.getAll()
      setInitialBlogs(blogs)
    }
    initBlogs()
  }, [])

  useEffect(() => {
    setBlogs(initialBlogs)
  }, [initialBlogs])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("userLoggedIn")
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password,
      })
      window.localStorage.setItem("userLoggedIn", JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername("")
      setPassword("")
    } catch (exception) {
      setError("Wrong username or password.")
      setTimeout(() => {
        setError(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem("userLoggedIn")
    setUser(null)
  }

  const createNew = async (blogObj) => {
    createFormRef.current.toggleVisibility()
    const returnedBlog = await blogService.create(blogObj)
    setInitialBlogs(initialBlogs.concat(returnedBlog))
    setMsg(`A new blog "${blogObj.title}" by "${blogObj.author}" is added.`)
    setTimeout(() => {
      setMsg(null)
    }, 5000)
  }


  //click "like" button to give one like for a blog post
  const addLike = async (blog) => {
    const updatedLikes = blog.likes + 1

    const updatedBlog = await blogService.update(blog.id, {
      user: blog.user.username,
      likes: updatedLikes,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    })

    blogUpdated(updatedBlog)
  }

  //update likes for blog
  const blogUpdated = (updatedBlog) => {
    setInitialBlogs((initialBlogs) =>
      initialBlogs.map((blog) => {
        if (blog.id === updatedBlog.id) {
          return { ...blog, likes: updatedBlog.likes }
        }
        return blog
      })
    )
  }

  const blogDeleted = (deletedBlogId) => {
    setInitialBlogs((initialBlogs) =>
      initialBlogs.filter((blog) => blog.id !== deletedBlogId)
    )
  }

  //sort blogs by the amout of likes from the highest to lowest
  const sortBlogs = () => {
    if (sort) {
      setBlogs(initialBlogs)
    } else {
      setBlogs(
        [...initialBlogs].sort((a, b) => {
          return b.likes - a.likes
        })
      )
    }
    setSort(!sort)
  }

  //show login form when user has not logged into the application
  if (user === null) {
    return (
      <LoginForm
        username={username}
        password={password}
        handleLogin={handleLogin}
        setUsername={setUsername}
        setPassword={setPassword}
        error={error}
      />
    )
  }

  //when user has logged in show blogs
  return (
    <div>
      <h2>BLOGS</h2>
      <Notification msg={msg} />
      <div>
        <p>
          Logged in as {user.name}
          <button id="logoutBtn" onClick={handleLogout}>Logout</button>
        </p>
      </div>
      <Togglable ref={createFormRef}>
        <CreateForm createNew={createNew} />
      </Togglable>
      <div></div>
      <p>BLOG POSTS:</p>
      <button id="sortBtn" onClick={sortBlogs}>Sort posts by likes</button>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          canDelete={blog.user.username === user.username}
          addLike={addLike}
          blogDeleted={blogDeleted}
        />
      ))}
    </div>
  )
}
export default App
