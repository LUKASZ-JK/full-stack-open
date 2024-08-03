import { createSlice } from '@reduxjs/toolkit'

import blogService from '../services/blogs'

import { displayNotification } from './notificationReducer'

const initialState = []
const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    setBlogs(state, action) {
      return action.payload.sort((a, b) => b.likes - a.likes)
    },
    appendBlog(state, action) {
      state.push(action.payload)
    },
    increaseLikes(state, action) {
      const likedBlog = action.payload
      return state.map(blog => (blog.id !== likedBlog.id ? blog : likedBlog)).sort((a, b) => b.likes - a.likes)
    },
    removeBlog(state, action) {
      const id = action.payload
      return state.filter(blog => blog.id !== id)
    },
    appendComment(state, action) {
      const commentedBlog = action.payload
      return state.map(blog => (blog.id !== commentedBlog.id ? blog : commentedBlog)).sort((a, b) => b.likes - a.likes)
    }
  }
})

export const { setBlogs, appendBlog, increaseLikes, removeBlog, appendComment } = blogSlice.actions

export const initializeBlogs = () => {
  return async dispatch => {
    try {
      const blogs = await blogService.getAll()
      dispatch(setBlogs(blogs))
    } catch (exception) {
      dispatch(
        displayNotification({
          message: 'Failed to connect to the server',
          type: 'error',
          duration: 3000
        })
      )
    }
  }
}

export const createBlog = blogObject => {
  return async dispatch => {
    try {
      const newBlog = await blogService.create(blogObject)
      dispatch(appendBlog(newBlog))
      dispatch(
        displayNotification({
          message: `A new blog '${blogObject.title}' by ${blogObject.author} added`,
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

export const giveLike = blogObject => {
  return async dispatch => {
    try {
      const updatedBlog = {
        ...blogObject,
        likes: blogObject.likes + 1
      }
      const likedBlog = await blogService.update(blogObject.id, updatedBlog)
      dispatch(increaseLikes(likedBlog))
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

export const deleteBlog = blog => {
  return async dispatch => {
    try {
      await blogService.remove(blog.id)
      dispatch(removeBlog(blog.id))
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

export const addComment = (id, comment) => {
  return async dispatch => {
    try {
      const commentedBlog = await blogService.comment(id, comment)
      dispatch(appendComment(commentedBlog))
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

export default blogSlice.reducer
