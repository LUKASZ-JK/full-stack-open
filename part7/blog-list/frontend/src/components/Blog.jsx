import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, increaseLikes, currentUser, removeBlog }) => {
  const [visible, setVisible] = useState(false)
  const [removable, setRemovable] = useState(false)

  const showWhenVisible = { display: visible ? '' : 'none' }

  const buttonText = visible ? 'hide' : 'show'

  useEffect(() => {
    setRemovable(blog.user.username === currentUser.username ? true : false)
  }, [blog.user.username, currentUser.username])

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const addLike = async () => {
    const blogObject = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      user: blog.user.id,
      likes: blog.likes + 1
    }
    increaseLikes(blog.id, blogObject)
  }

  const deleteBlog = async () => {
    removeBlog(blog)
  }

  const removeButton = () =>
    removable ? (
      <>
        <br />
        <button onClick={deleteBlog}>remove</button>
      </>
    ) : null

  return (
    <div className="blog">
      {blog.title} by {blog.author} <button onClick={toggleVisibility}>{buttonText}</button>
      <div className="details" style={showWhenVisible}>
        {blog.url}
        <br />
        likes: {blog.likes} <button onClick={addLike}>like</button>
        <br />
        {blog.user.name}
        {removeButton()}
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  increaseLikes: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
  removeBlog: PropTypes.func.isRequired
}

export default Blog
