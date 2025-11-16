import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NewsList } from './index'
import type { NewsFilters } from '@/types/news'
import { useNews as useNewsOriginal } from './use-news'
import { useAppSelector as useAppSelectorOriginal } from '@/hooks/store'

vi.mock('./use-news')
vi.mock('@/hooks/store')
vi.mock('../sidebar-portal', () => ({
  SidebarPortal: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-portal">{children}</div>
  ),
}))
vi.mock('../navbar-lef-slot-portal', () => ({
  NavbarLeftSlotPortal: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="navbar-left-slot-portal">{children}</div>
  ),
}))
vi.mock('./filter-icon', () => ({
  FilterIcon: ({
    onClick,
    className,
  }: {
    onClick: () => void
    className?: string
  }) => (
    <button data-testid="filter-icon" onClick={onClick} className={className}>
      Filter
    </button>
  ),
}))
vi.mock('./filters', () => ({
  NewsListFilters: ({
    onChange,
    filterItemsConfig,
  }: {
    filters: NewsFilters
    onChange: (filters: Partial<NewsFilters>) => void
    filterItemsConfig?: unknown
  }) => (
    <div data-testid="news-list-filters">
      <div data-testid="filters-config">
        {JSON.stringify(filterItemsConfig)}
      </div>
      <button
        data-testid="change-filters"
        onClick={() => onChange({ searchQuery: 'test query' })}
      >
        Change Filters
      </button>
    </div>
  ),
}))
vi.mock('./item', () => ({
  NewsListItem: ({ article }: { article: { id: string; title: string } }) => (
    <div data-testid={`news-item-${article.id}`}>{article.title}</div>
  ),
}))
vi.mock('@/components/grid', () => ({
  Grid: ({
    items,
    isLoading,
    isLoadingMore,
    onLoadMore,
    hasMore,
    renderItem,
    className,
  }: {
    items: unknown[]
    isLoading: boolean
    isLoadingMore: boolean
    onLoadMore: () => void
    hasMore: boolean
    renderItem: (item: unknown) => React.ReactNode
    className?: string
  }) => (
    <div data-testid="grid" className={className}>
      {isLoading && <div data-testid="loading">Loading...</div>}
      {isLoadingMore && <div data-testid="loading-more">Loading more...</div>}
      {hasMore && (
        <button data-testid="load-more" onClick={onLoadMore}>
          Load More
        </button>
      )}
      {items.map((item, index) => (
        <div key={index}>{renderItem(item)}</div>
      ))}
    </div>
  ),
}))
vi.mock('@/components/modal', () => ({
  Modal: ({
    isOpen,
    onClose,
    title,
    children,
    footer,
  }: {
    isOpen: boolean
    onClose: () => void
    title: string
    children: React.ReactNode
    footer?: React.ReactNode
  }) =>
    isOpen ? (
      <div data-testid="modal">
        <div data-testid="modal-title">{title}</div>
        <button data-testid="modal-close" onClick={onClose}>
          Close
        </button>
        <div data-testid="modal-content">{children}</div>
        {footer && <div data-testid="modal-footer">{footer}</div>}
      </div>
    ) : null,
}))
vi.mock('@/components/button', () => ({
  Button: ({
    children,
    onClick,
  }: {
    children: React.ReactNode
    onClick?: () => void
  }) => (
    <button data-testid="button" onClick={onClick}>
      {children}
    </button>
  ),
}))

const useNews = vi.mocked(useNewsOriginal)
const useAppSelector = vi.mocked(useAppSelectorOriginal)

describe('NewsList', () => {
  const mockArticles = [
    {
      id: '1',
      title: 'Article 1',
      description: 'Description 1',
      url: 'https://example.com/1',
      urlToImage: null,
      publishedAt: '2024-01-01',
      author: 'Author 1',
      source: { id: 'guardian', name: 'Guardian' },
      content: null,
    },
    {
      id: '2',
      title: 'Article 2',
      description: 'Description 2',
      url: 'https://example.com/2',
      urlToImage: null,
      publishedAt: '2024-01-02',
      author: 'Author 2',
      source: { id: 'ny-times', name: 'NY Times' },
      content: null,
    },
  ]

  const mockFilters: NewsFilters = {
    sources: ['guardian'],
    page: 1,
    pageSize: 10,
  }

  const defaultUseNewsReturn = {
    items: mockArticles,
    isLoading: false,
    isLoadingMore: false,
    loadMore: vi.fn(),
    hasMore: true,
    onFiltersChange: vi.fn(),
    activeFilters: mockFilters,
    data: {
      guardian: {},
      'ny-times': {},
      'news-api': {},
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
    useNews.mockReturnValue(defaultUseNewsReturn)
    useAppSelector.mockReturnValue(false) // Default to desktop (not mobile)
  })

  it('should render with default props', () => {
    render(<NewsList />)

    expect(screen.getByTestId('sidebar-portal')).toBeInTheDocument()
    expect(screen.getByTestId('news-list-filters')).toBeInTheDocument()
    expect(screen.getByTestId('grid')).toBeInTheDocument()
    expect(screen.getByTestId('news-item-1')).toBeInTheDocument()
    expect(screen.getByTestId('news-item-2')).toBeInTheDocument()
  })

  it('should render filters in sidebar on desktop', () => {
    useAppSelector.mockReturnValue(false) // Desktop

    render(<NewsList />)

    expect(screen.getByTestId('sidebar-portal')).toBeInTheDocument()
    expect(
      screen.queryByTestId('navbar-left-slot-portal'),
    ).not.toBeInTheDocument()
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
  })

  it('should render filter icon in navbar on mobile', () => {
    useAppSelector.mockReturnValue(true) // Mobile

    render(<NewsList />)

    expect(screen.getByTestId('navbar-left-slot-portal')).toBeInTheDocument()
    expect(screen.getByTestId('filter-icon')).toBeInTheDocument()
    expect(screen.queryByTestId('sidebar-portal')).not.toBeInTheDocument()
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
  })

  it('should open filter modal when filter icon is clicked on mobile', async () => {
    const user = userEvent.setup()
    useAppSelector.mockReturnValue(true) // Mobile

    render(<NewsList />)

    const filterIcon = screen.getByTestId('filter-icon')
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument()

    await user.click(filterIcon)

    expect(screen.getByTestId('modal')).toBeInTheDocument()
    expect(screen.getByTestId('modal-title')).toHaveTextContent('Filters')
    expect(screen.getByTestId('news-list-filters')).toBeInTheDocument()
  })

  it('should close filter modal when close button is clicked', async () => {
    const user = userEvent.setup()
    useAppSelector.mockReturnValue(true) // Mobile

    render(<NewsList />)

    await user.click(screen.getByTestId('filter-icon'))
    expect(screen.getByTestId('modal')).toBeInTheDocument()

    await user.click(screen.getByTestId('modal-close'))
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
  })

  it('should close filter modal when Apply button is clicked', async () => {
    const user = userEvent.setup()
    useAppSelector.mockReturnValue(true) // Mobile

    render(<NewsList />)

    await user.click(screen.getByTestId('filter-icon'))
    expect(screen.getByTestId('modal')).toBeInTheDocument()

    // Close modal via Apply button
    const applyButton = screen.getByTestId('button')
    await user.click(applyButton)
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
  })

  it('should pass initialFilters to useNews hook', () => {
    const initialFilters: Partial<NewsFilters> = {
      searchQuery: 'test',
      sources: ['guardian'],
    }

    render(<NewsList initialFilters={initialFilters} />)

    expect(useNews).toHaveBeenCalledWith({
      initialFilters,
      onFiltersChange: undefined,
    })
  })

  it('should call onFiltersChange when filters change', () => {
    const onFiltersChange = vi.fn()

    render(<NewsList onFiltersChange={onFiltersChange} />)

    expect(useNews).toHaveBeenCalledWith({
      initialFilters: undefined,
      onFiltersChange,
    })
  })

  it('should pass filterItemsConfig to NewsListFilters', () => {
    const filterItemsConfig = {
      search: true,
      author: false,
      date: true,
      sources: false,
      categories: true,
    }

    render(<NewsList filterItemsConfig={filterItemsConfig} />)

    const configElement = screen.getByTestId('filters-config')
    expect(configElement).toHaveTextContent(JSON.stringify(filterItemsConfig))
  })

  it('should pass filterItemsConfig to modal filters on mobile', async () => {
    const user = userEvent.setup()
    useAppSelector.mockReturnValue(true) // Mobile

    const filterItemsConfig = {
      search: false,
      author: true,
      date: false,
      sources: true,
      categories: false,
    }

    render(<NewsList filterItemsConfig={filterItemsConfig} />)

    await user.click(screen.getByTestId('filter-icon'))

    const configElement = screen.getByTestId('filters-config')
    expect(configElement).toHaveTextContent(JSON.stringify(filterItemsConfig))
  })

  it('should pass correct props to Grid component', () => {
    const loadMore = vi.fn()
    useNews.mockReturnValue({
      ...defaultUseNewsReturn,
      isLoading: true,
      isLoadingMore: false,
      hasMore: true,
      loadMore,
    })

    render(<NewsList />)

    expect(screen.getByTestId('grid')).toHaveClass('h-full')
    expect(screen.getByTestId('loading')).toBeInTheDocument()
    expect(screen.getByTestId('load-more')).toBeInTheDocument()
  })

  it('should show loading more state in Grid', () => {
    useNews.mockReturnValue({
      ...defaultUseNewsReturn,
      isLoading: false,
      isLoadingMore: true,
      hasMore: true,
    })

    render(<NewsList />)

    expect(screen.getByTestId('loading-more')).toBeInTheDocument()
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
  })

  it('should call loadMore when Load More button is clicked', async () => {
    const user = userEvent.setup()
    const loadMore = vi.fn()
    useNews.mockReturnValue({
      ...defaultUseNewsReturn,
      loadMore,
      hasMore: true,
    })

    render(<NewsList />)

    const loadMoreButton = screen.getByTestId('load-more')
    await user.click(loadMoreButton)

    expect(loadMore).toHaveBeenCalledTimes(1)
  })

  it('should not show Load More button when hasMore is false', () => {
    useNews.mockReturnValue({
      ...defaultUseNewsReturn,
      hasMore: false,
    })

    render(<NewsList />)

    expect(screen.queryByTestId('load-more')).not.toBeInTheDocument()
  })

  it('should render news items in Grid', () => {
    render(<NewsList />)

    expect(screen.getByTestId('news-item-1')).toHaveTextContent('Article 1')
    expect(screen.getByTestId('news-item-2')).toHaveTextContent('Article 2')
  })

  it('should render empty state when no items', () => {
    useNews.mockReturnValue({
      ...defaultUseNewsReturn,
      items: [],
      data: {
        guardian: {},
        'ny-times': {},
        'news-api': {},
      },
    })

    render(<NewsList />)

    expect(screen.getByTestId('grid')).toBeInTheDocument()
    expect(screen.queryByTestId('news-item-1')).not.toBeInTheDocument()
  })

  it('should handle filter changes from NewsListFilters', async () => {
    const user = userEvent.setup()
    const onFiltersChange = vi.fn()
    useNews.mockReturnValue({
      ...defaultUseNewsReturn,
      onFiltersChange,
    })

    render(<NewsList />)

    const changeFiltersButton = screen.getByTestId('change-filters')
    await user.click(changeFiltersButton)

    expect(onFiltersChange).toHaveBeenCalledWith({ searchQuery: 'test query' })
  })

  it('should handle filter changes in modal', async () => {
    const user = userEvent.setup()
    useAppSelector.mockReturnValue(true) // Mobile
    const onFiltersChange = vi.fn()
    useNews.mockReturnValue({
      ...defaultUseNewsReturn,
      onFiltersChange,
    })

    render(<NewsList />)

    await user.click(screen.getByTestId('filter-icon'))

    const changeFiltersButton = screen.getByTestId('change-filters')
    await user.click(changeFiltersButton)

    expect(onFiltersChange).toHaveBeenCalledWith({ searchQuery: 'test query' })
  })

  it('should pass activeFilters to NewsListFilters', () => {
    const customFilters: NewsFilters = {
      sources: ['ny-times'],
      searchQuery: 'test',
      page: 1,
      pageSize: 20,
    }

    useNews.mockReturnValue({
      ...defaultUseNewsReturn,
      activeFilters: customFilters,
    })

    render(<NewsList />)

    expect(screen.getByTestId('news-list-filters')).toBeInTheDocument()
  })
})
