import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DateRangePicker } from './index'
import { vi } from 'vitest'

interface DatePickerProps {
  selected?: Date | null
  onChange: (dates: [Date | null, Date | null]) => void
  startDate?: Date | null
  endDate?: Date | null
  selectsRange?: boolean
  showIcon?: boolean
  className?: string
  wrapperClassName?: string
  shouldCloseOnSelect?: boolean
}

// Mock react-datepicker
vi.mock('react-datepicker', () => {
  return {
    __esModule: true,
    default: function MockDatePicker(props: DatePickerProps) {
      const {
        onChange,
        selected,
        startDate,
        endDate,
        selectsRange: _selectsRange,
        showIcon: _showIcon,
        wrapperClassName: _wrapperClassName,
        shouldCloseOnSelect: _shouldCloseOnSelect,
        ...rest
      } = props
      return (
        <input
          type="text"
          data-testid="date-picker"
          data-selected={selected?.toISOString() || ''}
          data-start-date={startDate?.toISOString() || ''}
          data-end-date={endDate?.toISOString() || ''}
          onChange={() => {
            // Simulate date selection
            const mockStartDate = startDate || new Date('2024-01-01')
            const mockEndDate = endDate || new Date('2024-01-02')
            onChange([mockStartDate, mockEndDate])
          }}
          onClick={() => {
            // Simulate date selection on click as well
            const mockStartDate = startDate || new Date('2024-01-01')
            const mockEndDate = endDate || new Date('2024-01-02')
            onChange([mockStartDate, mockEndDate])
          }}
          {...rest}
        />
      )
    },
  }
})

describe('DateRangePicker', () => {
  const defaultProps = {
    onChange: vi.fn(),
  }

  test('renders date picker input', () => {
    render(<DateRangePicker {...defaultProps} />)
    const datePicker = screen.getByTestId('date-picker')
    expect(datePicker).toBeInTheDocument()
  })

  test('applies correct className', () => {
    render(<DateRangePicker {...defaultProps} />)
    const datePicker = screen.getByTestId('date-picker')
    expect(datePicker).toHaveClass(
      'w-full',
      'rounded-md',
      'border',
      'border-gray-300',
    )
  })

  test('calls onChange when date is selected', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<DateRangePicker onChange={onChange} />)

    const datePicker = screen.getByTestId('date-picker')
    await user.click(datePicker)

    expect(onChange).toHaveBeenCalled()
  })

  test('displays startDate when provided', () => {
    const startDate = new Date('2024-01-01')
    render(<DateRangePicker {...defaultProps} startDate={startDate} />)
    const datePicker = screen.getByTestId('date-picker')
    expect(datePicker).toHaveAttribute(
      'data-start-date',
      startDate.toISOString(),
    )
  })

  test('displays endDate when provided', () => {
    const endDate = new Date('2024-01-02')
    render(<DateRangePicker {...defaultProps} endDate={endDate} />)
    const datePicker = screen.getByTestId('date-picker')
    expect(datePicker).toHaveAttribute('data-end-date', endDate.toISOString())
  })

  test('handles null startDate', () => {
    render(<DateRangePicker {...defaultProps} startDate={null} />)
    const datePicker = screen.getByTestId('date-picker')
    expect(datePicker).toHaveAttribute('data-start-date', '')
  })

  test('handles null endDate', () => {
    render(<DateRangePicker {...defaultProps} endDate={null} />)
    const datePicker = screen.getByTestId('date-picker')
    expect(datePicker).toHaveAttribute('data-end-date', '')
  })
})
