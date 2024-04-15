const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'Cooking',
    author: 'Someone excited about cooking',
    url: 'https://www.blog-about-cooking.com',
    likes: 947
  },
  {
    title: 'Books',
    author: 'Someone excited about books',
    url: 'https://www.blog-about-books.com',
    likes: 566
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs,
  blogsInDb,
  usersInDb
}
