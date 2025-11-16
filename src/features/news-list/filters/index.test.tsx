import { render, screen } from '@testing-library/react'
import { NewsListFilters, type NewsListFiltersProps } from '.'
import { SOURCES_OPTIONS, CATEGORIES_OPTIONS } from '../constants'
import { vi, describe, it, expect } from 'vitest'

describe('NewsListFilters', () => {
  const defaultFilters: NewsListFiltersProps['filters'] = {
    searchQuery: 'hello',
    author: 'John Doe',
    dateFrom: new Date('2025-01-01'),
    dateTo: new Date('2025-01-10'),
    sources: [SOURCES_OPTIONS[0].id],
    categories: [CATEGORIES_OPTIONS[0].id],
    page: 1,
    pageSize: 10,
  }

  it('renders all filter items by default', () => {
    const onChange = vi.fn()
    render(<NewsListFilters filters={defaultFilters} onChange={onChange} />)

    SOURCES_OPTIONS.forEach(source => {
      expect(screen.getByText(source.name)).toBeDefined()
    })
    CATEGORIES_OPTIONS.forEach(category => {
      expect(screen.getByText(category.name)).toBeDefined()
    })

    expect(screen.getByText(/Search by keyword/i)).toBeDefined()
    expect(screen.getByText(/Author/i)).toBeDefined()
  })

  it('respects filterItemsConfig to hide certain items', () => {
    const onChange = vi.fn()
    render(
      <NewsListFilters
        filters={defaultFilters}
        onChange={onChange}
        filterItemsConfig={{
          search: false,
          author: false,
          date: false,
          sources: true,
          categories: false,
        }}
      />,
    )

    SOURCES_OPTIONS.forEach(source => {
      expect(screen.getByText(source.name)).toBeDefined()
    })
    CATEGORIES_OPTIONS.forEach(category => {
      expect(screen.queryByText(category.name)).toBeNull()
    })
    expect(screen.queryByLabelText(/Search by keyword/i)).toBeNull()
    expect(screen.queryByLabelText(/Author/i)).toBeNull()
  })
})
