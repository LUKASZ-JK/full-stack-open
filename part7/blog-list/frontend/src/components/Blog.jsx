import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import {
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Icon,
  Container,
  Box,
  Link,
  Button,
  FormControl,
  TextField
} from '@mui/material'

const Blog = ({ blog, addLike, currentUser, removeBlog, submitComment }) => {
  const [removable, setRemovable] = useState(false)
  const [comment, setComment] = useState('')

  useEffect(() => {
    setRemovable(blog.user.username === currentUser.username ? true : false)
  }, [blog.user.username, currentUser.username])

  const addComment = async event => {
    event.preventDefault()
    submitComment(blog.id, comment)
    setComment('')
  }

  const removeButton = () =>
    removable ? (
      <Button variant="contained" color="error" onClick={() => removeBlog(blog)}>
        remove
      </Button>
    ) : null

  return (
    <Box mt={4}>
      <Typography variant="h2" gutterBottom>
        {blog.title} by {blog.author}
      </Typography>
      <Box mb={4}>
        <Link href={blog.url}>{blog.url}</Link>
        <p>likes: {blog.likes}</p>
        <Button size="medium" variant="contained" onClick={() => addLike(blog)}>
          like
        </Button>
        <p>added by {blog.user.name}</p>
        {removeButton()}
      </Box>
      <Box>
        <Typography variant="h4" component="h3" gutterBottom>
          Comments
        </Typography>
        <Box component="form" onSubmit={addComment}>
          <FormControl sx={{ display: 'flex', flexDirection: 'row' }}>
            <TextField
              type="text"
              value={comment}
              label="Comment"
              variant="outlined"
              required
              aria-label="comment"
              onChange={event => setComment(event.target.value)}
            />
            <Button size="medium" variant="contained" type="submit" sx={{ ml: 4 }}>
              add comment
            </Button>
          </FormControl>
        </Box>
        <List>
          {blog.comments.map((comment, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                <Icon>comment</Icon>
              </ListItemIcon>
              <ListItemText primary={comment} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  addLike: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
  removeBlog: PropTypes.func.isRequired
}

export default Blog
