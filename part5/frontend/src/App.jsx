import './index.css'

import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import { Notification } from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

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
    <form onSubmit={handleLogin}>
      <div>
        username
        <input type="text" value={username} name="Username" onChange={({ target }) => setUsername(target.value)} />
      </div>
      <div>
        password
        <input type="password" value={password} name="Password" onChange={({ target }) => setPassword(target.value)} />
      </div>
      <button type="submit">login</button>
    </form>
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
      setNotification({
        message: `Logged in as ${username}`,
        type: 'success'
      })
      setTimeout(() => {
        setNotification(null)
      }, 3000)
    } catch (exception) {
      setNotification({
        message: 'Wrong credentials',
        type: 'error'
      })
      setTimeout(() => {
        setNotification(null)
      }, 3000)
    }
  }

  const handleLogout = async event => {
    event.preventDefault()
    try {
      window.localStorage.removeItem('loggedBlogappUser')
      setUser(null)
      setNotification({
        message: `Logged out ${username}`,
        type: 'success'
      })
      setTimeout(() => {
        setNotification(null)
      }, 3000)
    } catch (exception) {
      setNotification({
        message: 'Failed to logout',
        type: 'error'
      })
      setTimeout(() => {
        setNotification(null)
      }, 3000)
    }
  }

  const addBlog = async blogObject => {
    try {
      blogFormRef.current.toggleVisibility()
      const response = await blogService.create(blogObject)
      setBlogs(blogs.concat(response))
      setNotification({
        message: `A new blog '${response.title}' by ${response.author} added`,
        type: 'success'
      })
      setTimeout(() => {
        setNotification(null)
      }, 3000)
    } catch (exception) {
      setNotification({
        message: exception.message,
        type: 'error'
      })
      setTimeout(() => {
        setNotification(null)
      }, 3000)
    }
  }

  const addLike = async (id, blogObject) => {
    try {
      const response = await blogService.update(id, blogObject)
      setBlogs(blogs.map(blog => (blog.id !== id ? blog : response)).sort((a, b) => b.likes - a.likes))
    } catch (exception) {
      setNotification({
        message: exception.message,
        type: 'error'
      })
      setTimeout(() => {
        setNotification(null)
      }, 3000)
    }
  }

  const deleteBlog = async blog => {
    if (window.confirm(`Delete ${blog.title} by ${blog.author}?`)) {
      try {
        const response = await blogService.remove(blog.id)
        setBlogs(blogs.filter(b => b.id !== blog.id))
        setNotification({
          message: `Blog '${blog.title}' by ${blog.author} removed`,
          type: 'success'
        })
        setTimeout(() => {
          setNotification(null)
        }, 3000)
      } catch (exception) {
        setNotification({
          message: exception.message,
          type: 'error'
        })
        setTimeout(() => {
          setNotification(null)
        }, 3000)
      }
    }
  }

  return (
    <div>
      <Notification notification={notification} />
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
