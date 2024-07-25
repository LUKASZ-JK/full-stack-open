import { useDispatch } from 'react-redux'
import { addAnecdote } from '../reducers/anecdoteReducer'
import { setNotification, removeNotification } from '../reducers/notificationReducer'

import anecdoteService from '../services/anecdotes.js'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const createAnectode = async e => {
    e.preventDefault()
    const content = e.target.anecdote.value
    e.target.anecdote.value = ''
    const newAnecdotee = await anecdoteService.createNew(content)
    dispatch(addAnecdote(newAnecdotee))
    dispatch(setNotification(`you added ${content}`))
    setTimeout(() => {
      dispatch(removeNotification())
    }, 5000)
  }
  return (
    <>
      <h2>create new</h2>
      <form onSubmit={createAnectode}>
        <div>
          <input name="anecdote" />
        </div>
        <button>create</button>
      </form>
    </>
  )
}

export default AnecdoteForm
