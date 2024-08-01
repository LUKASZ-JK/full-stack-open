import './index.css'

import { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { displayNotification } from './reducers/notificationReducer'

import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import { Notification } from './components/Notification'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'

const App = () => {
  const dispatch = useDispatch()

  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs => {
      blogs.sort((a, b) => b.likes - a.likes)
      setBlogs(blogs)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const loginForm = () => (
    <LoginForm
      username={username}
      password={password}
      handleUsernameChange={({ target }) => setUsername(target.value)}
      handlePasswordChange={({ target }) => setPassword(target.value)}
      handleSubmit={handleLogin}
    />
  )

  const blogsSection = () => (
    <>
      <h2>blogs</h2>
      <Togglable buttonLabel="New blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
      <br />
      <br />
      <div>
        {blogs.map(blog => (
          <Blog key={blog.id} blog={blog} increaseLikes={addLike} currentUser={user} removeBlog={deleteBlog} />
        ))}
      </div>
    </>
  )

  const handleLogin = async event => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      dispatch(
        displayNotification({
          message: `Logged in as ${username}`,
          type: 'success',
          duration: 3000
        })
      )
    } catch (exception) {
      dispatch(
        displayNotification({
          message: 'Wrong credentials',
          type: 'error',
          duration: 3000
        })
      )
    }
  }

  const handleLogout = async event => {
    event.preventDefault()
    try {
      window.localStorage.removeItem('loggedBlogappUser')
      setUser(null)
      dispatch(
        displayNotification({
          message: `Logged out ${username}`,
          type: 'success',
          duration: 3000
        })
      )
    } catch (exception) {
      dispatch(
        displayNotification({
          message: 'Failed to logout',
          type: 'error',
          duration: 3000
        })
      )
    }
  }

  const addBlog = async blogObject => {
    try {
      blogFormRef.current.toggleVisibility()
      const response = await blogService.create(blogObject)
      setBlogs(blogs.concat(response))
      dispatch(
        displayNotification({
          message: `A new blog '${response.title}' by ${response.author} added`,
          type: 'success',
          duration: 3000
        })
      )
    } catch (exception) {
      dispatch(
        displayNotification({
          message: exception.message,
          type: 'error',
          duration: 3000
        })
      )
    }
  }

  const addLike = async (id, blogObject) => {
    try {
      const response = await blogService.update(id, blogObject)
      setBlogs(blogs.map(blog => (blog.id !== id ? blog : response)).sort((a, b) => b.likes - a.likes))
    } catch (exception) {
      dispatch(
        displayNotification({
          message: exception.message,
          type: 'error',
          duration: 3000
        })
      )
    }
  }

  const deleteBlog = async blog => {
    if (window.confirm(`Delete ${blog.title} by ${blog.author}?`)) {
      try {
        const response = await blogService.remove(blog.id)
        setBlogs(blogs.filter(b => b.id !== blog.id))
        dispatch(
          displayNotification({
            message: `Blog '${blog.title}' by ${blog.author} removed`,
            type: 'success',
            duration: 3000
          })
        )
      } catch (exception) {
        dispatch(
          displayNotification({
            message: exception.message,
            type: 'error',
            duration: 3000
          })
        )
      }
    }
  }

  return (
    <div>
      <Notification />
      {user === null ? (
        loginForm()
      ) : (
        <div>
          <p>{user.name} logged-in</p>
          <button onClick={handleLogout}>Logout</button>
          {blogsSection()}
        </div>
      )}
    </div>
  )
}

export default App
