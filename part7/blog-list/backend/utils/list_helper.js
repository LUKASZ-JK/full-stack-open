const _ = require('lodash')

const dummy = blogs => {
  return 1
}

const totalLikes = blogs => {
  const likes = blogs.map(blog => {
    return blog.likes
  })
  const total = likes.reduce((acc, val) => acc + val, 0)
  return total
}

const favoriteBlog = blogs => {
  const favorite = blogs.reduce((best, current) => {
    return (best = best.likes > current.likes ? best : current)
  })
  let { title, author, likes } = favorite
  return { title, author, likes }
}

const mostBlogs = blogs => {
  return _(blogs)
    .countBy('author')
    .map((a, b) => ({
      author: b,
      blogs: a
    }))
    .maxBy('blogs')
}

const mostLikes = blogs => {
  return _(blogs)
    .groupBy('author')
    .map((blogsObject, author) => ({
      author: author,
      likes: _.sumBy(blogsObject, 'likes')
    }))
    .maxBy('likes')
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
