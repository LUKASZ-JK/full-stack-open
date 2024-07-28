import { useField } from '../hooks'

const CreateNew = props => {
  const content = useField('text')
  const author = useField('text')
  const info = useField('text')

  const handleSubmit = e => {
    e.preventDefault()
    props.addNew({
      content: content.inputField.value,
      author: author.inputField.value,
      info: info.inputField.value,
      votes: 0
    })
  }

  const handleReset = e => {
    content.reset()
    author.reset()
    info.reset()
  }
  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit} onReset={handleReset}>
        <div>
          content
          <input {...content.inputField} />
        </div>
        <div>
          author
          <input {...author.inputField} />
        </div>
        <div>
          url for more info
          <input {...info.inputField} />
        </div>
        <button>create</button>
        <button type="reset">reset</button>
      </form>
    </div>
  )
}

export default CreateNew
