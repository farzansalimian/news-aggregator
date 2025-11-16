import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Modal } from './index'
import { vi } from 'vitest'

describe('Modal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    children: <div>Modal Content</div>,
  }

  beforeEach(() => {
    // Clear document.body before each test
    document.body.innerHTML = ''
  })

  test('renders modal content when isOpen is true', () => {
    render(<Modal {...defaultProps} />)
    expect(screen.getByText('Modal Content')).toBeInTheDocument()
  })

  test('renders title when provided', () => {
    render(<Modal {...defaultProps} title="Test Modal" />)
    expect(screen.getByText('Test Modal')).toBeInTheDocument()
  })

  test('renders footer when provided', () => {
    const footer = <button>Close</button>
    render(<Modal {...defaultProps} footer={footer} />)
    expect(screen.getByText('Close')).toBeInTheDocument()
  })

  test('calls onClose when header is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<Modal {...defaultProps} onClose={onClose} title="Test" />)

    const header = screen.getByText('Test').closest('div')
    if (header) {
      await user.click(header)
      expect(onClose).toHaveBeenCalledTimes(1)
    }
  })

  test('renders close icon', () => {
    render(<Modal {...defaultProps} />)
    const closeIcon = document.querySelector('svg')
    expect(closeIcon).toBeInTheDocument()
  })

  test('renders children when keepContentMounted is true and isOpen is false', () => {
    render(<Modal {...defaultProps} isOpen={false} keepContentMounted={true} />)
    expect(screen.getByText('Modal Content')).toBeInTheDocument()
  })

  test('does not render children when keepContentMounted is false and isOpen is false', () => {
    render(
      <Modal {...defaultProps} isOpen={false} keepContentMounted={false} />,
    )
    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument()
  })

  test('applies correct classes when isOpen is true', () => {
    render(<Modal {...defaultProps} />)
    const modal = document.body.querySelector('.opacity-100')
    expect(modal).toBeInTheDocument()
  })

  test('applies correct classes when isOpen is false', () => {
    render(<Modal {...defaultProps} isOpen={false} />)
    const modal = document.body.querySelector('.opacity-0')
    expect(modal).toBeInTheDocument()
  })

  test('renders in portal to document.body', () => {
    render(<Modal {...defaultProps} />)
    const modal = document.body.querySelector('.fixed')
    expect(modal).toBeInTheDocument()
  })
})
