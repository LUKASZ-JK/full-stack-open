import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Note />', () => {
  const blog = {
    title: 'Test title',
    author: 'Test author',
    url: 'http://testurl.com',
    user: 'TestUser',
    likes: 42
  }
  const mockAddLike = vi.fn()
  const mockDeleteBlog = vi.fn()
  const user = {
    user: 'TestUser'
  }

  let container

  beforeEach(() => {
    container = render(
      <Blog blog={blog} increaseLikes={mockAddLike} currentUser={user} removeBlog={mockDeleteBlog} />
    ).container
  })

  test('renders shortened preview', () => {
    const blogDiv = container.querySelector('.blog')
    expect(blogDiv).toHaveTextContent('Test title')
    const detailsDiv = blogDiv.querySelector('.details')
    expect(detailsDiv).toHaveStyle('display: none')
  })

  test('after clicking the show button, details are displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('show')
    await user.click(button)

    const detailsDiv = container.querySelector('.details')
    expect(detailsDiv).not.toHaveStyle('display: none')
  })

  test('when like button is clicked twice, the event handler is called twice', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('like')
    for (let i = 0; i < 2; i++) {
      await user.click(button)
    }
    expect(mockAddLike.mock.calls).toHaveLength(2)
  })
})
