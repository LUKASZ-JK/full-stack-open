import './index.css'

import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import { Notification } from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs))
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

  const blogForm = () => (
    <>
      <h2>blogs</h2>
      <form onSubmit={addBlog}>
        <label htmlFor="Title">Title</label>
        <input type="text" value={title} name="Title" required onChange={({ target }) => setTitle(target.value)} />
        <br />
        <label htmlFor="Author">Author</label>
        <input type="text" value={author} name="Author" required onChange={({ target }) => setAuthor(target.value)} />
        <br />
        <label htmlFor="URL">URL</label>
        <input type="url" value={url} name="URL" required onChange={({ target }) => setUrl(target.value)} />
        <br />
        <button type="create">Add</button>
      </form>
      <br />
      <br />
      <div>
        {blogs.map(blog => (
          <Blog key={blog.id} blog={blog} />
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

  const addBlog = async event => {
    event.preventDefault()
    try {
      const response = await blogService.create({ title, author, url })
      setBlogs(blogs.concat(response))
      setTitle('')
      setAuthor('')
      setUrl('')
      setNotification({
        message: `A new blog '${title}' by ${author} added`,
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

  return (
    <div>
      <Notification notification={notification} />
      {user === null ? (
        loginForm()
      ) : (
        <div>
          <p>{user.name} logged-in</p>
          <button onClick={handleLogout}>Logout</button>
          {blogForm()}
        </div>
      )}
    </div>
  )
}

export default App
