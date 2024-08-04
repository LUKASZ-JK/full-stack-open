import { useState } from 'react'

import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

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
    <Box component="form" onSubmit={addBlog} mb={4}>
      <FormControl sx={{ display: 'flex', flexDirection: 'row' }}>
        <TextField
          type="text"
          id="title-input"
          value={title}
          name="Title"
          label="Title"
          required
          onChange={event => setTitle(event.target.value)}
          sx={{ mr: 4 }}
        />
        <TextField
          type="text"
          id="author-input"
          value={author}
          name="Author"
          label="Author"
          required
          onChange={event => setAuthor(event.target.value)}
          sx={{ mr: 4 }}
        />
        <TextField
          type="url"
          id="url-input"
          value={url}
          name="URL"
          label="URL"
          required
          onChange={event => setUrl(event.target.value)}
          sx={{ mr: 4 }}
        />
        <Button variant="contained" type="create">
          add
        </Button>
      </FormControl>
    </Box>
  )
}

export default BlogForm
