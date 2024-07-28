const Anecdote = ({ anecdote, vote }) => {
  const style = { marginBottom: '1rem' }

  return (
    <div style={style}>
      <h2>
        {anecdote.content} by {anecdote.author}
      </h2>
      <p>has {anecdote.votes} votes</p>
      <p>
        for more info see <a href={anecdote.info}>{anecdote.info}</a>
      </p>
      <button onClick={vote}>vote</button>
    </div>
  )
}

export default Anecdote
