import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './index'
import { vi } from 'vitest'

describe('Button', () => {
  test('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  test('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(<Button onClick={onClick}>Press</Button>)

    await user.click(screen.getByText('Press'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  test('applies custom className', () => {
    render(<Button className="custom-class">Test</Button>)
    const btn = screen.getByText('Test')

    expect(btn.className).toContain('custom-class')
  })
})
