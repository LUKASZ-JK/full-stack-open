import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, addLike, currentUser, removeBlog }) => {
  const [removable, setRemovable] = useState(false)

  useEffect(() => {
    setRemovable(blog.user.username === currentUser.username ? true : false)
  }, [blog.user.username, currentUser.username])

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
