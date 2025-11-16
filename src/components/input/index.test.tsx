import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from './index'
import { vi } from 'vitest'

describe('Input', () => {
  const defaultProps = {
    value: '',
    onChange: vi.fn(),
  }

  test('renders input element', () => {
    render(<Input {...defaultProps} />)
    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
  })

  test('displays value', () => {
    render(<Input {...defaultProps} value="test value" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('test value')
  })

  test('calls onChange when value changes', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Input {...defaultProps} onChange={onChange} />)

    const input = screen.getByRole('textbox')
    await user.type(input, 'test')

    expect(onChange).toHaveBeenCalled()
  })

  test('renders label when provided', () => {
    render(<Input {...defaultProps} label="Test Label" />)
    expect(screen.getByText('Test Label')).toBeInTheDocument()
  })

  test('does not render label when not provided', () => {
    render(<Input {...defaultProps} />)
    const label = screen.queryByText('Test Label')
    expect(label).not.toBeInTheDocument()
  })

  test('label is associated with input via htmlFor', () => {
    render(<Input {...defaultProps} label="Test Label" />)
    const input = screen.getByRole('textbox')
    const label = screen.getByText('Test Label')

    expect(input).toHaveAttribute('id')
    expect(label).toHaveAttribute('for', input.getAttribute('id'))
  })

  test('applies correct className to input', () => {
    render(<Input {...defaultProps} />)
    const input = screen.getByRole('textbox')
    expect(input.className).toContain('w-full')
    expect(input.className).toContain('rounded-md')
    expect(input.className).toContain('border')
    expect(input.className).toContain('border-gray-300')
    expect(input.className).toContain('p-2')
  })

  test('calls onChange with correct value', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Input {...defaultProps} onChange={onChange} />)

    const input = screen.getByRole('textbox')
    await user.type(input, 'a')

    expect(onChange).toHaveBeenCalledWith('a')
  })
})
