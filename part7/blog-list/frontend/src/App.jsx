import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createSelector } from '@reduxjs/toolkit'
import { initializeBlogs, createBlog, giveLike, deleteBlog, addComment } from './reducers/blogReducer'
import { initializeUser, loginUser, logoutUser } from './reducers/userReducer'
import { initializeUsers } from './reducers/usersReducer'

import { Routes, Route, Link, useMatch, useNavigate } from 'react-router-dom'

import Blog from './components/Blog'
import { Notification } from './components/Notification'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import User from './components/User'

import CssBaseline from '@mui/material/CssBaseline'
import { Container, Box, Stack, Paper, Typography, AppBar, Toolbar, Button } from '@mui/material'
import { styled } from '@mui/material/styles'

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

  const selectBlogs = state => state.blog
  const selectUsers = state => state.users

  const selectUpdatedUsers = createSelector([selectBlogs, selectUsers], (blogs, users) => {
    return users.map(user => ({
      ...user,
      blogs: blogs.filter(blog => blog.user.id === user.id)
    }))
  })

  const blogs = useSelector(selectBlogs)
  const users = useSelector(selectUpdatedUsers)

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

  const submitComment = async (blogId, comment) => {
    dispatch(addComment(blogId, comment))
  }

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary
  }))

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
    <Box mt={4}>
      <Typography variant="h2" gutterBottom>
        Blogs
      </Typography>
      <Box mb={4}>
        <Togglable buttonLabel="New blog" ref={blogFormRef}>
          <BlogForm createBlog={addBlog} />
        </Togglable>
      </Box>
      <Box sx={{ width: '60%', mx: 'auto' }}>
        <Stack spacing={2}>
          {blogs.map(blog => (
            <Item key={blog.id}>
              <Link to={`/blogs/${blog.id}`}>
                {blog.title} by {blog.author}
              </Link>
            </Item>
          ))}
        </Stack>
      </Box>
    </Box>
  )

  const NavSection = () => {
    const userInfo = () =>
      currentUser ? (
        <>
          <Typography variant="h6" component="p" ml="auto" mr={4}>
            {currentUser.name} logged-in
          </Typography>
          <Button color="inherit" onClick={handleLogout} sx={{ mr: 2 }}>
            Logout
          </Button>
        </>
      ) : null

    return (
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component={Link} to="/" mr={4} sx={{ textDecoration: 'none' }}>
              Blogs
            </Typography>
            <Typography variant="h6" component={Link} to="/users" mr={4} sx={{ textDecoration: 'none' }}>
              Users
            </Typography>
            {userInfo()}
          </Toolbar>
        </AppBar>
      </Box>
    )
  }

  const MainSection = ({ children }) => <>{currentUser === null ? loginForm() : <div>{children}</div>}</>

  const UsersSection = () => (
    <Box mt={4}>
      <Typography variant="h2" gutterBottom>
        Users
      </Typography>
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
    </Box>
  )

  return (
    <>
      <CssBaseline />
      <div>
        <NavSection />
        <Container>
          <Notification />
          <MainSection>
            <Routes>
              <Route path="/" element={<BlogsSection />} />
              <Route
                path="/blogs/:id"
                element={
                  currentUser && blog ? (
                    <>
                      <Blog
                        blog={blog}
                        addLike={addLike}
                        currentUser={currentUser}
                        removeBlog={removeBlog}
                        submitComment={submitComment}
                      />
                    </>
                  ) : null
                }
              />
              <Route path="/users" element={<UsersSection />} />
              <Route path="/users/:id" element={user ? <User user={user} /> : null} />
            </Routes>
          </MainSection>
        </Container>
      </div>
    </>
  )
}

export default App
