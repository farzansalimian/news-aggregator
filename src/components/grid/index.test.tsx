import { render, screen } from '@testing-library/react'
import { Grid } from './index'
import { vi } from 'vitest'

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = vi.fn()
  disconnect = vi.fn()
  unobserve = vi.fn()
  constructor() {}
}

// @ts-expect-error - Mocking IntersectionObserver
global.IntersectionObserver =
  MockIntersectionObserver as unknown as typeof IntersectionObserver

describe('Grid', () => {
  const mockItems = [
    { id: '1', name: 'Item 1' },
    { id: '2', name: 'Item 2' },
    { id: '3', name: 'Item 3' },
  ]

  const renderItem = (item: { id: string; name: string }) => (
    <div data-testid={`item-${item.id}`}>{item.name}</div>
  )

  test('renders items', () => {
    render(<Grid items={mockItems} renderItem={renderItem} />)

    expect(screen.getByTestId('item-1')).toBeInTheDocument()
    expect(screen.getByTestId('item-2')).toBeInTheDocument()
    expect(screen.getByTestId('item-3')).toBeInTheDocument()
  })

  test('renders empty state when items array is empty and not loading', () => {
    render(<Grid items={[]} renderItem={renderItem} />)
    expect(screen.getByText('No more items')).toBeInTheDocument()
  })

  test('does not render empty state when loading', () => {
    render(<Grid items={[]} renderItem={renderItem} isLoading={true} />)
    expect(screen.queryByText('No more items')).not.toBeInTheDocument()
  })

  test('does not render empty state when loading more', () => {
    render(<Grid items={[]} renderItem={renderItem} isLoadingMore={true} />)
    expect(screen.queryByText('No more items')).not.toBeInTheDocument()
  })

  test('renders spinner when loading', () => {
    const { container } = render(
      <Grid items={[]} renderItem={renderItem} isLoading={true} />,
    )
    const spinner = container.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
  })

  test('renders spinner when loading more', () => {
    const { container } = render(
      <Grid items={mockItems} renderItem={renderItem} isLoadingMore={true} />,
    )
    const spinner = container.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
  })

  test('applies custom className', () => {
    const { container } = render(
      <Grid
        items={mockItems}
        renderItem={renderItem}
        className="custom-class"
      />,
    )
    const grid = container.firstChild as HTMLElement
    expect(grid.className).toContain('custom-class')
  })

  test('uses custom itemKey for keys', () => {
    const items = [
      { customId: 'a', name: 'Item A' },
      { customId: 'b', name: 'Item B' },
    ]
    render(
      <Grid
        items={items}
        renderItem={item => <div>{item.name}</div>}
        itemKey="customId"
      />,
    )
    expect(screen.getByText('Item A')).toBeInTheDocument()
    expect(screen.getByText('Item B')).toBeInTheDocument()
  })

  test('renders load more sentinel when hasMore is true', () => {
    const { container } = render(
      <Grid
        items={mockItems}
        renderItem={renderItem}
        hasMore={true}
        onLoadMore={vi.fn()}
      />,
    )
    const sentinel = container.querySelector('[class*="col-span-full"]')
    expect(sentinel).toBeInTheDocument()
  })

  test('does not render load more sentinel when hasMore is false', () => {
    const { container } = render(
      <Grid items={mockItems} renderItem={renderItem} hasMore={false} />,
    )
    const sentinel = container.querySelector('[class*="col-span-full"]')
    expect(sentinel).not.toBeInTheDocument()
  })
})
