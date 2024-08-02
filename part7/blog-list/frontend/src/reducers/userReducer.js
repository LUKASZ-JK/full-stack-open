import { createSlice } from '@reduxjs/toolkit'

import loginService from '../services/login'
import blogService from '../services/blogs'

import { displayNotification } from './notificationReducer'

const initialState = null
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      return action.payload
    },
    logout(state, action) {
      return null
    }
  }
})

export const { setUser, logout } = userSlice.actions

export const initializeUser = () => {
  return dispatch => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      dispatch(setUser(user))
    }
  }
}

export const loginUser = (username, password) => {
  return async dispatch => {
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      dispatch(setUser(user))
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
}

export const logoutUser = user => {
  return async dispatch => {
    try {
      dispatch(logout())
      window.localStorage.removeItem('loggedBlogappUser')
      blogService.setToken(null)
      dispatch(
        displayNotification({
          message: `Logged out ${user.username}`,
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
}

export default userSlice.reducer
