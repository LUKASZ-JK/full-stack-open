import './index.css'

import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs, createBlog, giveLike, deleteBlog } from './reducers/blogReducer'
import { initializeUser, loginUser, logoutUser } from './reducers/userReducer'
import { initializeUsers } from './reducers/usersReducer'

import { Routes, Route, Link, useMatch, useNavigate } from 'react-router-dom'

import Blog from './components/Blog'
import { Notification } from './components/Notification'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import User from './components/User'

const App = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const blogFormRef = useRef()

  useEffect(() => {
    dispatch(initializeUser())
  }, [dispatch])

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    dispatch(initializeUsers())
  }, [dispatch])

  const currentUser = useSelector(({ user }) => {
    return user
  })

  const blogs = useSelector(({ blog }) => {
    return blog
  })

  const users = useSelector(({ users }) => {
    return users
  })

  const matchUser = useMatch('/users/:id')
  const user = matchUser ? users.find(user => user.id === matchUser.params.id) : null

  const matchBlog = useMatch('/blogs/:id')
  const blog = matchBlog ? blogs.find(blog => blog.id === matchBlog.params.id) : null

  const handleLogin = async event => {
    event.preventDefault()
    dispatch(loginUser(username, password))
    setUsername('')
    setPassword('')
  }

  const handleLogout = async event => {
    event.preventDefault()
    dispatch(logoutUser(currentUser))
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
      navigate('/')
    }
  }

  const loginForm = () => (
    <LoginForm
      username={username}
      password={password}
      handleUsernameChange={({ target }) => setUsername(target.value)}
      handlePasswordChange={({ target }) => setPassword(target.value)}
      handleSubmit={handleLogin}
    />
  )

  const BlogsSection = () => (
    <>
      <h2>blogs</h2>
      <Togglable buttonLabel="New blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
      <br />
      <br />
      <div>
        {blogs.map(blog => (
          <div key={blog.id} className="blog">
            <Link to={`/blogs/${blog.id}`}>
              {blog.title} by {blog.author}
            </Link>
          </div>
        ))}
      </div>
    </>
  )

  const MainSection = ({ children }) => (
    <>
      {currentUser === null ? (
        loginForm()
      ) : (
        <div>
          <p>{currentUser.name} logged-in</p>
          <button onClick={handleLogout}>Logout</button>
          {children}
        </div>
      )}
    </>
  )

  const UsersSection = () => (
    <>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.username}>
              <td>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )

  return (
    <>
      <div>
        <Notification />
        <MainSection>
          <Routes>
            <Route path="/" element={<BlogsSection />} />
            <Route
              path="/blogs/:id"
              element={
                currentUser &&
                blog && <Blog blog={blog} addLike={addLike} currentUser={currentUser} removeBlog={removeBlog} />
              }
            />
            <Route path="/users" element={<UsersSection />} />
            <Route path="/users/:id" element={user && <User user={user} />} />
          </Routes>
        </MainSection>
      </div>
    </>
  )
}

export default App
