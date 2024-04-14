const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('blogs have id property', async () => {
  const response = await api.get('/api/blogs')
  response.body.forEach(blog => {
    assert(blog.hasOwnProperty('id'))
  })
})

test('a valid blog can be added ', async () => {
  const newBlog = {
    title: 'Cats',
    author: 'Someone excited about cats',
    url: 'https://www.blog-about-cats.com',
    likes: 1359
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
  const urls = blogsAtEnd.map(blog => blog.url)
  assert(urls.includes(newBlog.url))
})

test('blog with missing likes gets a value of 0 ', async () => {
  const newBlog = {
    title: 'Dogs',
    author: 'Someone excited about dogs',
    url: 'https://www.blog-about-dogs.com'
  }

  const savedBlog = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
  assert.strictEqual(savedBlog.body.likes, 0)
})

test('blog with missing title or url gets rejected ', async () => {
  const blogs = [
    {
      author: 'Someone excited about',
      url: 'https://www.blog-about-.com',
      likes: 15
    },
    {
      title: 'Title',
      author: 'Someone excited about',
      likes: 15
    }
  ]

  for (let blog of blogs) {
    await api.post('/api/blogs').send(blog).expect(400)
  }

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

after(async () => {
  await mongoose.connection.close()
})
