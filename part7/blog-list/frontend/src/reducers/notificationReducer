import { createSlice } from '@reduxjs/toolkit'

const initialState = { message: null, type: null, timeoutId: null }

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification(state, action) {
      return { ...state, message: action.payload.message, type: action.payload.type }
    },
    clearCurrentNotification(state, action) {
      return { ...state, message: null, type: null }
    },
    setTimeoutId(state, action) {
      return { ...state, timeoutId: action.payload.timeoutId }
    },
    clearCurrentTimeoutId(state, action) {
      return { ...state, timeoutId: null }
    }
  }
})

export const { setNotification, clearCurrentNotification, setTimeoutId, clearCurrentTimeoutId } =
  notificationSlice.actions

export const displayNotification = ({ message, type, duration }) => {
  return (dispatch, getState) => {
    const timeoutId = getState().notification.timeoutId
    clearTimeout(timeoutId)
    dispatch(clearCurrentTimeoutId())
    dispatch(setNotification({ message, type }))
    const id = setTimeout(() => {
      dispatch(clearCurrentNotification())
    }, duration)
    dispatch(setTimeoutId({ timeoutId: id }))
  }
}

export default notificationSlice.reducer
