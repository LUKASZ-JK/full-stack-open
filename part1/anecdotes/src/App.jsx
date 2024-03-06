import { useState } from 'react'

const Button = ({ onClick, text }) => {
  return (
    <button onClick={onClick}>{text}</button>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [selected, setSelected] = useState(0)

  const [points, setPoints] = useState(Array(anecdotes.length).fill(0))

  const [maxPoints, setMaxPoints] = useState(0);

  const handleNextClick = () => {
    let random = Math.floor(Math.random() * anecdotes.length)
    do {
      random = Math.floor(Math.random() * anecdotes.length)
    } while (random === selected)
    setSelected(random)
  }

  const handleVoteClick = () => {
    const newPoints = [...points]
    newPoints[selected] += 1
    setPoints(newPoints)
    const newMaxPoints = newPoints.indexOf(Math.max(...newPoints))
    setMaxPoints(newMaxPoints)
  }

  if (Math.max(...points) === 0) {
    return (
      <div>
        <h2>Anecdote of the day</h2>
        {anecdotes[selected]}<br />
        has {points[selected]} votes<br />
        <Button onClick={handleVoteClick} text={'vote'}/>
        <Button onClick={handleNextClick} text={'next anectode'}/>
        <h2>Anecdote with most votes</h2>
      </div>
    )
  }

  return (
    <div>
      <h2>Anecdote of the day</h2>
      {anecdotes[selected]}<br />
      has {points[selected]} votes<br />
      <Button onClick={handleVoteClick} text={'vote'}/>
      <Button onClick={handleNextClick} text={'next anectode'}/>
      <h2>Anecdote with most votes</h2>
      {anecdotes[maxPoints]}<br />
    </div>
  )
}

export default App