import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Checkbox } from './index'
import { vi } from 'vitest'

describe('Checkbox', () => {
  const defaultProps = {
    label: 'Test Checkbox',
    onChange: vi.fn(),
  }

  test('renders label', () => {
    render(<Checkbox {...defaultProps} />)
    expect(screen.getByText('Test Checkbox')).toBeInTheDocument()
  })

  test('renders checkbox input', () => {
    render(<Checkbox {...defaultProps} />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeInTheDocument()
  })

  test('checkbox is checked when checked prop is true', () => {
    render(<Checkbox {...defaultProps} checked={true} />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeChecked()
  })

  test('checkbox is unchecked when checked prop is false', () => {
    render(<Checkbox {...defaultProps} checked={false} />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()
  })

  test('checkbox is unchecked when checked prop is undefined', () => {
    render(<Checkbox {...defaultProps} />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()
  })

  test('calls onChange when checkbox is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Checkbox {...defaultProps} onChange={onChange} />)

    const checkbox = screen.getByRole('checkbox')
    await user.click(checkbox)

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(true)
  })

  test('calls onChange with false when unchecking', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Checkbox {...defaultProps} onChange={onChange} checked={true} />)

    const checkbox = screen.getByRole('checkbox')
    await user.click(checkbox)

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(false)
  })

  test('calls onChange when label is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Checkbox {...defaultProps} onChange={onChange} />)

    const label = screen.getByText('Test Checkbox')
    await user.click(label)

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(true)
  })

  test('applies custom className', () => {
    const { container } = render(
      <Checkbox {...defaultProps} className="custom-class" />,
    )
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.className).toContain('custom-class')
  })

  test('label is associated with input via htmlFor', () => {
    render(<Checkbox {...defaultProps} />)
    const checkbox = screen.getByRole('checkbox')
    const label = screen.getByText('Test Checkbox')

    expect(checkbox).toHaveAttribute('id')
    expect(label).toHaveAttribute('for', checkbox.getAttribute('id'))
  })

  test('label has cursor-pointer class', () => {
    render(<Checkbox {...defaultProps} />)
    const label = screen.getByText('Test Checkbox')
    expect(label.className).toContain('cursor-pointer')
  })
})
