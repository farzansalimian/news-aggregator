import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { Link } from './index'

describe('Link', () => {
  test('renders Link component from react-router', () => {
    render(
      <MemoryRouter>
        <Link to="/test">Test Link</Link>
      </MemoryRouter>,
    )
    const link = screen.getByRole('link', { name: 'Test Link' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/test')
  })

  test('renders children correctly', () => {
    render(
      <MemoryRouter>
        <Link to="/about">About Page</Link>
      </MemoryRouter>,
    )
    expect(screen.getByText('About Page')).toBeInTheDocument()
  })

  test('navigates to correct path', () => {
    render(
      <MemoryRouter>
        <Link to="/home">Home</Link>
      </MemoryRouter>,
    )
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/home')
  })
})
