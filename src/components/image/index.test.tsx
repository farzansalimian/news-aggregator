import { render, screen, fireEvent } from '@testing-library/react'
import { Image } from './index'

// Mock PNG import
vi.mock('./placeholder.png', () => ({
  default: 'placeholder.png',
}))

describe('Image component', () => {
  it('renders the main image when src is provided and no error occurs', () => {
    render(<Image src="test.jpg" alt="main" width={100} height={100} />)

    const img = screen.getByAltText('main')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'test.jpg')
  })

  it('renders placeholder when src is missing', () => {
    render(<Image alt="main" width={100} height={100} />)

    const placeholder = screen.getByAltText('image placeholder')
    expect(placeholder).toBeInTheDocument()
    expect(placeholder).toHaveAttribute('src', 'placeholder.png')
  })

  it('renders placeholder when an image error occurs', () => {
    render(<Image src="bad.jpg" alt="broken" width={100} height={100} />)

    const img = screen.getByAltText('broken')

    // trigger error
    fireEvent.error(img)

    const placeholder = screen.getByAltText('image placeholder')
    expect(placeholder).toBeInTheDocument()
    expect(placeholder).toHaveAttribute('src', 'placeholder.png')
  })

  it('renders custom placeholder when provided', () => {
    render(
      <Image
        src="bad.jpg"
        alt="bad"
        placeholder={<div data-testid="custom-ph" />}
      />,
    )

    fireEvent.error(screen.getByAltText('bad'))

    const custom = screen.getByTestId('custom-ph')
    expect(custom).toBeInTheDocument()
  })
})
