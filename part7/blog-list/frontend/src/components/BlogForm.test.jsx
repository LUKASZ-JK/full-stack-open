import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm /> submits blog with corrent content using provided handler', async () => {
  const user = userEvent.setup()
  const addBlog = vi.fn()

  const { container } = render(<BlogForm createBlog={addBlog} />)

  const titleInput = container.querySelector('#title-input')
  const authorInput = container.querySelector('#author-input')
  const urlInput = container.querySelector('#url-input')

  await user.type(titleInput, 'Title typed in by user')
  await user.type(authorInput, 'Author typed in by user')
  await user.type(urlInput, 'http://urlTypedInByUser.test')

  const addButton = screen.getByText('add')
  await user.click(addButton)

  expect(addBlog.mock.calls).toHaveLength(1)
  expect(addBlog.mock.calls[0][0].title).toBe('Title typed in by user')
  expect(addBlog.mock.calls[0][0].author).toBe('Author typed in by user')
  expect(addBlog.mock.calls[0][0].url).toBe('http://urlTypedInByUser.test')
})
