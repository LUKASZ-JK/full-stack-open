import { useState } from 'react'

const Button = ({ onClick, text }) => {
  return (
    <button onClick={onClick}>{text}</button>
  )
}

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <th style={{ textAlign: 'left' }}>{text}:</th>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = (props) => {
  const good = props.values[0]
  const neutral = props.values[1]
  const bad = props.values[2]
  const all = good + neutral + bad
  const average = (good - bad) / all
  const positive = ((good / all) * 100) + '%';
  if (all === 0) {
    return (
      <>
        No feedback given
      </>
    )
  }
  return (
    <>
      <table>
        <tbody>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="all" value={all} />
          <StatisticLine text="average" value={average} />
          <StatisticLine text="positive" value={positive} />
        </tbody>
      </table>

    </>

  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => { setGood(good + 1) }
  const handleNeutralClick = () => { setNeutral(neutral + 1) }
  const handleBadClick = () => { setBad(bad + 1) }


  return (
    <div>
      <h2>give feedback</h2>
      <Button onClick={handleGoodClick} text='good' />
      <Button onClick={handleNeutralClick} text='neutral' />
      <Button onClick={handleBadClick} text='bad' />
      <h2>statistics</h2>
      <Statistics values={[good, neutral, bad]} />
    </div>
  )
}

export default App