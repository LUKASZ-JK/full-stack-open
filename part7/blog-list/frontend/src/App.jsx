import './index.css'

import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs, createBlog, giveLike, deleteBlog } from './reducers/blogReducer'
import { initializeUser, loginUser, logoutUser } from './reducers/userReducer'

import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import { Notification } from './components/Notification'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'

const App = () => {
  const dispatch = useDispatch()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const blogFormRef = useRef()

  useEffect(() => {
    dispatch(initializeUser())
  }, [dispatch])

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  const blogs = useSelector(({ blog }) => {
    return blog
  })

  const user = useSelector(({ user }) => {
    return user
  })

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
          <Blog key={blog.id} blog={blog} addLike={addLike} currentUser={user} removeBlog={removeBlog} />
        ))}
      </div>
    </>
  )

  const handleLogin = async event => {
    event.preventDefault()
    dispatch(loginUser(username, password))
    setUsername('')
    setPassword('')
  }

  const handleLogout = async event => {
    event.preventDefault()
    dispatch(logoutUser(user))
  }

  const addBlog = async blogObject => {
    dispatch(createBlog(blogObject))
    blogFormRef.current.toggleVisibility()
  }

  const addLike = async blogObject => {
    dispatch(giveLike(blogObject))
  }

  const removeBlog = async blog => {
    if (window.confirm(`Delete ${blog.title} by ${blog.author}?`)) {
      dispatch(deleteBlog(blog))
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
