const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, findBlogByTitle, likeBlog, removeBlog } = require('./helper')
const { before } = require('node:test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await page.goto('/')
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })
    await request.post('/api/users', {
      data: {
        name: 'Second User',
        username: 'secondUser',
        password: 'testingPermissions'
      }
    })
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText('Matti Luukkainen logged-in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'incorrect', 'data')

      const errorDiv = await page.locator('.error')
      await expect(errorDiv).toContainText('Wrong credentials')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })

    describe('When logged in', () => {
      beforeEach(async ({ page }) => {
        await loginWith(page, 'mluukkai', 'salainen')
      })

      test('a new blog can be created', async ({ page }) => {
        await createBlog(page, 'title created for testing', 'playwright', 'http://playwright.test')
        await expect(page.getByText('title created for testing by playwright')).toBeVisible()
      })
      describe('and a blog exists', () => {
        beforeEach(async ({ page }) => {
          await createBlog(page, 'title1 created for testing', 'playwright1', 'http://playwright1.test')
          await createBlog(page, 'title2 created for testing', 'playwright2', 'http://playwright2.test')
          await createBlog(page, 'title3 created for testing', 'playwright3', 'http://playwright3.test')
        })

        test('like can be given', async ({ page }) => {
          const blog = {
            title: 'title2 created for testing',
            author: 'playwright2'
          }
          await likeBlog(page, blog.title, blog.author, 1)
          const likedBlog = await findBlogByTitle(page, blog.title, blog.author)
          await expect(likedBlog.getByText('likes: 1')).toBeVisible()
        })

        test('blogs are ordered according to likes', async ({ page }) => {
          test.slow()
          const blog1 = {
            title: 'title1 created for testing',
            author: 'playwright1'
          }
          const blog2 = {
            title: 'title2 created for testing',
            author: 'playwright2'
          }
          const blog3 = {
            title: 'title3 created for testing',
            author: 'playwright3'
          }
          await page.goto('/')
          await likeBlog(page, blog2.title, blog2.author, 3)
          await likeBlog(page, blog3.title, blog3.author, 1)
          await likeBlog(page, blog1.title, blog1.author, 0)

          const blogs = await page.locator('.blog').all()
          await expect(blogs[0].getByText('playwright2')).toBeVisible()
          await expect(blogs[1].getByText('playwright3')).toBeVisible()
          await expect(blogs[2].getByText('playwright1')).toBeVisible()
        })

        describe('another user is logged in', () => {
          beforeEach(async ({ page }) => {
            await page.getByRole('button', { name: 'logout' }).click()
            await loginWith(page, 'secondUser', 'testingPermissions')
          })
          test('blog can be deleted', async ({ page }) => {
            const blog = {
              title: 'blog to be deleted',
              author: 'another user',
              url: 'http://delete.test'
            }
            await createBlog(page, blog.title, blog.author, blog.url)
            const createdBlog = await findBlogByTitle(page, blog.title, blog.author)

            await removeBlog(page, blog.title, blog.author)
            const successDiv = await page.locator('.success')
            await expect(successDiv).toContainText('removed')
            await expect(successDiv).toHaveCSS('border-style', 'solid')
            await expect(successDiv).toHaveCSS('color', 'rgb(0, 128, 0)')
            await expect(page.getByText(`${blog.title} by ${blog.author}`)).not.toBeVisible()
          })

          test('only current users blog have remove button', async ({ page }) => {
            //At the beginning there are no remove buttons on the page
            const removeButtonsAtTheBeginning = page.locator('button').filter({ hasText: 'remove' })
            await expect(removeButtonsAtTheBeginning).toHaveCount(0)

            const blog = {
              title: 'blog to be deleted',
              author: 'another user',
              url: 'http://delete.test'
            }
            await createBlog(page, blog.title, blog.author, blog.url)
            const createdBlog = await findBlogByTitle(page, blog.title, blog.author)

            //After user adds a blog there is one button
            const removeButtonsAtTheEnd = await createdBlog.locator('button').filter({ hasText: 'remove' })
            await expect(removeButtonsAtTheEnd).toHaveCount(1)
          })
        })
      })
    })
  })
})
