const bcrypt = require('bcrypt')

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

const initialUser = {
  username: 'root',
  password: 'sekret'
}

const createInitialUser = async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash(`${initialUser.password}`, 10)
  const user = new User({ username: initialUser.username, passwordHash })
  await user.save()
  return user
}

const createInitialBlogs = async user => {
  await Blog.deleteMany({})

  for (let blog of initialBlogs) {
    let blogObject = new Blog(blog)
    blogObject.user = user
    await blogObject.save()
  }
}

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
  initialUser,
  blogsInDb,
  usersInDb,
  createInitialUser,
  createInitialBlogs
}
