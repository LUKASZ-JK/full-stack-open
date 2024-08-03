const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
    comments: body.comments || []
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  const populatedBlog = await Blog.findById(savedBlog.id).populate('user', {
    username: 1,
    name: 1
  })
  response.status(201).json(populatedBlog)
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    comments: body.comments
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true }).populate('user', {
    username: 1,
    name: 1
  })
  response.json(updatedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  const user = request.user

  if (blog.user.toString() === user.id.toString()) {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } else {
    return response.status(401).json({ error: 'no authorization' })
  }
})

blogsRouter.post('/:id/comments', middleware.userExtractor, async (request, response) => {
  const comment = request.body.comment

  if (!comment) {
    return response.status(400).send({ error: 'comment cannot be empty' })
  }

  const blog = await Blog.findById(request.params.id)
  blog.comments.push(comment)
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true }).populate('user', {
    username: 1,
    name: 1
  })
  response.json(updatedBlog)
})

module.exports = blogsRouter
