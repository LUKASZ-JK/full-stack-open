import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = async event => {
    event.preventDefault()

    createBlog({
      title: title,
      author: author,
      url: url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }
  return (
    <form onSubmit={addBlog}>
      <label htmlFor="Title">Title</label>
      <input
        type="text"
        id="title-input"
        value={title}
        name="Title"
        required
        onChange={event => setTitle(event.target.value)}
      />
      <br />
      <label htmlFor="Author">Author</label>
      <input
        type="text"
        id="author-input"
        value={author}
        name="Author"
        required
        onChange={event => setAuthor(event.target.value)}
      />
      <br />
      <label htmlFor="URL">URL</label>
      <input type="url" id="url-input" value={url} name="URL" required onChange={event => setUrl(event.target.value)} />
      <br />
      <button type="create">add</button>
    </form>
  )
}

export default BlogForm
