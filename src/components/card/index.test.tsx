import { render, screen } from '@testing-library/react'
import { Card } from './index'
import imagePlaceholder from './placeholder.png'

describe('Card', () => {
  const defaultProps = {
    title: 'Test Title',
    description: 'Test Description',
    url: 'https://www.example.com',
  }

  test('renders title', () => {
    render(<Card {...defaultProps} />)
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  test('renders description', () => {
    render(<Card {...defaultProps} />)
    expect(screen.getByText('Test Description')).toBeInTheDocument()
  })

  test('renders image with provided imageUrl', () => {
    const imageUrl = 'https://example.com/image.jpg'
    render(<Card {...defaultProps} imageUrl={imageUrl} />)
    const image = screen.getByAltText('Test Title')
    expect(image).toHaveAttribute('src', imageUrl)
  })

  test('renders placeholder image when imageUrl is not provided', () => {
    render(<Card {...defaultProps} />)
    const image = screen.getByAltText('Test Title')
    expect(image).toHaveAttribute('src', imagePlaceholder)
  })

  test('renders placeholder image when imageUrl is null', () => {
    render(<Card {...defaultProps} imageUrl={null} />)
    const image = screen.getByAltText('Test Title')
    expect(image).toHaveAttribute('src', imagePlaceholder)
  })

  test('renders footer when provided', () => {
    const footer = <div>Footer Content</div>
    render(<Card {...defaultProps} footer={footer} />)
    expect(screen.getByText('Footer Content')).toBeInTheDocument()
  })

  test('does not render footer when not provided', () => {
    render(<Card {...defaultProps} />)
    const footer = screen.queryByText('Footer Content')
    expect(footer).not.toBeInTheDocument()
  })

  test('renders topSlot when provided', () => {
    const topSlot = <span>Top Slot Content</span>
    render(<Card {...defaultProps} topSlot={topSlot} />)
    expect(screen.getByText('Top Slot Content')).toBeInTheDocument()
  })

  test('applies custom className', () => {
    const { container } = render(
      <Card {...defaultProps} className="custom-class" />,
    )
    const cardDiv = container.querySelector('.custom-class')
    expect(cardDiv).toBeInTheDocument()
  })

  test('link has correct href and target attributes', () => {
    render(<Card {...defaultProps} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', 'https://www.example.com')
    expect(link).toHaveAttribute('target', '_blank')
  })

  test('image has correct alt text', () => {
    render(<Card {...defaultProps} />)
    const image = screen.getByAltText('Test Title')
    expect(image).toBeInTheDocument()
  })
})
