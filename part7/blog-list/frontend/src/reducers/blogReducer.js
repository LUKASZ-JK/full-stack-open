import { createSlice } from '@reduxjs/toolkit'

import blogService from '../services/blogs'

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
    }
  }
})

export const { setBlogs, appendBlog, increaseLikes, removeBlog } = blogSlice.actions

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = blogObject => {
  return async dispatch => {
    const newBlog = await blogService.create(blogObject)
    dispatch(appendBlog(newBlog))
  }
}

export const giveLike = blogObject => {
  return async dispatch => {
    const updatedBlog = {
      ...blogObject,
      likes: blogObject.likes + 1
    }
    const likedBlog = await blogService.update(blogObject.id, updatedBlog)
    dispatch(increaseLikes(likedBlog))
  }
}

export const deleteBlog = blogId => {
  return async dispatch => {
    await blogService.remove(blogId)
    dispatch(removeBlog(blogId))
  }
}

export default blogSlice.reducer
