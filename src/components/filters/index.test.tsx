import { render, screen } from '@testing-library/react'
import { Filters } from './index'
import type { FilterItemProps } from './item'
import { vi } from 'vitest'

describe('Filters', () => {
  test('renders filter items', () => {
    const items: FilterItemProps[] = [
      {
        type: 'text',
        value: 'test',
        onChange: vi.fn(),
        label: 'Search',
      },
      {
        type: 'checkbox',
        label: 'Option 1',
        checked: true,
        onChange: vi.fn(),
      },
    ]

    render(<Filters items={items} />)

    expect(screen.getByLabelText('Search')).toBeInTheDocument()
    expect(screen.getByLabelText('Option 1')).toBeInTheDocument()
  })

  test('renders empty array without errors', () => {
    render(<Filters items={[]} />)
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  test('renders multiple filter items with correct order', () => {
    const items: FilterItemProps[] = [
      {
        type: 'text',
        value: 'first',
        onChange: vi.fn(),
        label: 'First Filter',
      },
      {
        type: 'text',
        value: 'second',
        onChange: vi.fn(),
        label: 'Second Filter',
      },
    ]

    render(<Filters items={items} />)

    const inputs = screen.getAllByRole('textbox')
    expect(inputs).toHaveLength(2)
    expect(inputs[0]).toHaveValue('first')
    expect(inputs[1]).toHaveValue('second')
  })

  test('applies mb-2 className to filter items', () => {
    const items: FilterItemProps[] = [
      {
        type: 'text',
        value: '',
        onChange: vi.fn(),
      },
    ]

    const { container } = render(<Filters items={items} />)
    const filterItem = container.firstChild as HTMLElement
    expect(filterItem.className).toContain('mb-2')
  })
})
