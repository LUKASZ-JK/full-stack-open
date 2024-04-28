const loginWith = async (page, username, password) => {
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'New blog' }).click()

  await page.locator('#title-input').fill(title)
  await page.locator('#author-input').fill(author)
  await page.locator('#url-input').fill(url)
  await page.getByRole('button', { name: 'add' }).click()
  await page
    .locator('.blog')
    .filter({
      hasText: `${title} by ${author}`
    })
    .waitFor()
}

const findBlogByTitle = async (page, title, author) =>
  await page.locator('.blog').filter({
    hasText: `${title} by ${author}`
  })

const likeBlog = async (page, title, author, likes) => {
  const blogElement = await findBlogByTitle(page, title, author)
  await blogElement.getByRole('button', { name: 'show' }).click()

  const expandedBlogElement = await findBlogByTitle(page, title, author)
  for (let i = 0; i < likes; i++) {
    await new Promise(resolve => setTimeout(resolve, 500)) // waiting before the like is given
    await expandedBlogElement.getByRole('button', { name: 'like' }).click()
  }
}

const removeBlog = async (page, title, author) => {
  const blogElement = await findBlogByTitle(page, title, author)
  await blogElement.getByRole('button', { name: 'show' }).click()

  const expandedBlogElement = await findBlogByTitle(page, title, author)
  page.on('dialog', dialog => dialog.accept())
  await expandedBlogElement.getByRole('button', { name: 'remove' }).click()
}

export { loginWith, createBlog, findBlogByTitle, likeBlog, removeBlog }
