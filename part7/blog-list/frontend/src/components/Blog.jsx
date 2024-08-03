import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

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
      <>
        <br />
        <button onClick={() => removeBlog(blog)}>remove</button>
      </>
    ) : null

  return (
    <div>
      <h2>
        {blog.title} by {blog.author}
      </h2>
      <div className="details">
        <a href={blog.url}>{blog.url}</a>
        <br />
        likes: {blog.likes} <button onClick={() => addLike(blog)}>like</button>
        <br />
        added by {blog.user.name}
        {removeButton()}
      </div>
      <div>
        <h2>comments</h2>
        <form onSubmit={addComment}>
          <input
            type="text"
            value={comment}
            required
            aria-label="comment"
            onChange={event => setComment(event.target.value)}
          />
          <button>add comment</button>
        </form>
        <ul>
          {blog.comments.map((comment, index) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  addLike: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
  removeBlog: PropTypes.func.isRequired
}

export default Blog
