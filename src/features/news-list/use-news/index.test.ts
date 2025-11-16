import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useNews } from './index'
import type { Article, NewsFilters } from '@/types/news'
import { SOURCES_IDS } from '../constants'
import { useLazyGetGuardianArticlesQuery } from '@/api/guardian'
import { useLazyGetNYTimesArticlesQuery } from '@/api/ny-times'
import { useLazyGetNewsApiArticlesQuery } from '@/api/news-api'
import { useDebounce } from '@/hooks/use-debounce'

// Mock dependencies
vi.mock('@/api/guardian')
vi.mock('@/api/ny-times')
vi.mock('@/api/news-api')
vi.mock('@/hooks/use-debounce')

const mockUseLazyGetGuardianArticlesQuery = vi.mocked(
  useLazyGetGuardianArticlesQuery,
)
const mockUseLazyGetNYTimesArticlesQuery = vi.mocked(
  useLazyGetNYTimesArticlesQuery,
)
const mockUseLazyGetNewsApiArticlesQuery = vi.mocked(
  useLazyGetNewsApiArticlesQuery,
)
const mockUseDebounce = vi.mocked(useDebounce)

describe('useNews', () => {
  const mockGuardianArticles: Article[] = [
    {
      id: 'guardian-1',
      title: 'Guardian Article 1',
      description: 'Description 1',
      url: 'https://guardian.com/1',
      urlToImage: null,
      publishedAt: '2024-01-01',
      author: 'Author 1',
      source: { id: 'guardian', name: 'Guardian' },
      content: null,
    },
  ]

  const mockNYTimesArticles: Article[] = [
    {
      id: 'nytimes-1',
      title: 'NY Times Article 1',
      description: 'Description 2',
      url: 'https://nytimes.com/1',
      urlToImage: null,
      publishedAt: '2024-01-02',
      author: 'Author 2',
      source: { id: 'ny-times', name: 'NY Times' },
      content: null,
    },
  ]

  const mockNewsApiArticles: Article[] = [
    {
      id: 'newsapi-1',
      title: 'News API Article 1',
      description: 'Description 3',
      url: 'https://newsapi.com/1',
      urlToImage: null,
      publishedAt: '2024-01-03',
      author: 'Author 3',
      source: { id: 'news-api', name: 'News API' },
      content: null,
    },
  ]

  const mockGetGuardianArticles = vi.fn()
  const mockGetNYTimesArticles = vi.fn()
  const mockGetNewsApiArticles = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    // Default debounce returns value immediately (synchronous for testing)
    mockUseDebounce.mockImplementation(value => value as never)

    // Make all API calls resolve immediately with empty data by default
    mockGetGuardianArticles.mockResolvedValue({
      data: { articles: [] },
    })
    mockGetNYTimesArticles.mockResolvedValue({
      data: { articles: [] },
    })
    mockGetNewsApiArticles.mockResolvedValue({
      data: { articles: [] },
    })

    mockUseLazyGetGuardianArticlesQuery.mockReturnValue([
      mockGetGuardianArticles,
      {
        isLoading: false,
        isError: false,
        reset: vi.fn(),
      } as never,
      {} as never,
    ])
    mockUseLazyGetNYTimesArticlesQuery.mockReturnValue([
      mockGetNYTimesArticles,
      {
        isLoading: false,
        isError: false,
        reset: vi.fn(),
      } as never,
      {} as never,
    ])
    mockUseLazyGetNewsApiArticlesQuery.mockReturnValue([
      mockGetNewsApiArticles,
      {
        isLoading: false,
        isError: false,
        reset: vi.fn(),
      } as never,
      {} as never,
    ])
  })

  it('should initialize with default filters', () => {
    const { result } = renderHook(() => useNews({}))

    expect(result.current.activeFilters).toEqual({
      sources: [
        SOURCES_IDS.GUARDIAN,
        SOURCES_IDS.NY_TIMES,
        SOURCES_IDS.NEWS_API,
      ],
      page: 1,
      pageSize: 10,
    })
  })

  it('should initialize with initialFilters', () => {
    const initialFilters: Partial<NewsFilters> = {
      searchQuery: 'test',
      sources: [SOURCES_IDS.GUARDIAN],
      page: 2,
    }

    const { result } = renderHook(() => useNews({ initialFilters }))

    expect(result.current.activeFilters).toEqual({
      sources: [SOURCES_IDS.GUARDIAN],
      page: 2,
      pageSize: 10,
      searchQuery: 'test',
    })
  })

  it('should fetch articles from all sources on mount', async () => {
    mockGetGuardianArticles.mockResolvedValue({
      data: { articles: mockGuardianArticles },
    })
    mockGetNYTimesArticles.mockResolvedValue({
      data: { articles: mockNYTimesArticles },
    })
    mockGetNewsApiArticles.mockResolvedValue({
      data: { articles: mockNewsApiArticles },
    })

    renderHook(() => useNews({}))

    await waitFor(() => {
      expect(mockGetGuardianArticles).toHaveBeenCalled()
      expect(mockGetNYTimesArticles).toHaveBeenCalled()
      expect(mockGetNewsApiArticles).toHaveBeenCalled()
    })
  })

  it('should combine articles from all sources', async () => {
    mockGetGuardianArticles.mockResolvedValue({
      data: { articles: mockGuardianArticles },
    })
    mockGetNYTimesArticles.mockResolvedValue({
      data: { articles: mockNYTimesArticles },
    })
    mockGetNewsApiArticles.mockResolvedValue({
      data: { articles: mockNewsApiArticles },
    })

    const { result } = renderHook(() => useNews({}))

    await waitFor(() => {
      expect(result.current.items.length).toBeGreaterThan(0)
    })

    const itemIds = result.current.items.map(item => item.id)
    expect(itemIds).toContain('guardian-1')
    expect(itemIds).toContain('nytimes-1')
    expect(itemIds).toContain('newsapi-1')
  })

  it('should only fetch from selected sources', async () => {
    mockGetGuardianArticles.mockResolvedValue({
      data: { articles: mockGuardianArticles },
    })

    const initialFilters: Partial<NewsFilters> = {
      sources: [SOURCES_IDS.GUARDIAN],
    }

    renderHook(() => useNews({ initialFilters }))

    await waitFor(() => {
      expect(mockGetGuardianArticles).toHaveBeenCalled()
      expect(mockGetNYTimesArticles).not.toHaveBeenCalled()
      expect(mockGetNewsApiArticles).not.toHaveBeenCalled()
    })
  })

  it('should set isLoading to true initially', () => {
    mockGetGuardianArticles.mockResolvedValue({
      data: { articles: [] },
    })
    mockGetNYTimesArticles.mockResolvedValue({
      data: { articles: [] },
    })
    mockGetNewsApiArticles.mockResolvedValue({
      data: { articles: [] },
    })

    const { result } = renderHook(() => useNews({}))

    expect(result.current.isLoading).toBe(true)
  })

  it('should set isLoading to false after fetching', async () => {
    mockGetGuardianArticles.mockResolvedValue({
      data: { articles: mockGuardianArticles },
    })
    mockGetNYTimesArticles.mockResolvedValue({
      data: { articles: mockNYTimesArticles },
    })
    mockGetNewsApiArticles.mockResolvedValue({
      data: { articles: mockNewsApiArticles },
    })

    const { result } = renderHook(() => useNews({}))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
  })

  it('should handle filter changes', async () => {
    mockGetGuardianArticles.mockResolvedValue({
      data: { articles: mockGuardianArticles },
    })
    mockGetNYTimesArticles.mockResolvedValue({
      data: { articles: mockNYTimesArticles },
    })
    mockGetNewsApiArticles.mockResolvedValue({
      data: { articles: mockNewsApiArticles },
    })

    const { result } = renderHook(() => useNews({}))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    vi.clearAllMocks()

    act(() => {
      result.current.onFiltersChange({ searchQuery: 'test query' })
    })

    await waitFor(() => {
      expect(result.current.activeFilters.searchQuery).toBe('test query')
      expect(result.current.activeFilters.page).toBe(1)
    })
  })

  it('should reset data and hasMore when filters change', async () => {
    mockGetGuardianArticles.mockResolvedValue({
      data: { articles: mockGuardianArticles },
    })
    mockGetNYTimesArticles.mockResolvedValue({
      data: { articles: mockNYTimesArticles },
    })
    mockGetNewsApiArticles.mockResolvedValue({
      data: { articles: mockNewsApiArticles },
    })

    const { result } = renderHook(() => useNews({}))

    await waitFor(() => {
      expect(result.current.items.length).toBeGreaterThan(0)
    })

    act(() => {
      result.current.onFiltersChange({ searchQuery: 'new query' })
    })

    // Data should be reset immediately
    expect(result.current.data).toEqual({
      [SOURCES_IDS.GUARDIAN]: {},
      [SOURCES_IDS.NY_TIMES]: {},
      [SOURCES_IDS.NEWS_API]: {},
    })
  })

  it('should not load more if hasMore is false', async () => {
    // Mock responses with fewer articles than pageSize to set hasMore to false
    mockGetGuardianArticles.mockResolvedValue({
      data: { articles: [] },
    })
    mockGetNYTimesArticles.mockResolvedValue({
      data: { articles: [] },
    })
    mockGetNewsApiArticles.mockResolvedValue({
      data: { articles: [] },
    })

    const { result } = renderHook(() => useNews({}))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    const pageBeforeLoadMore = result.current.activeFilters.page

    act(() => {
      result.current.loadMore()
    })

    // Page should not increment if hasMore is false
    expect(result.current.activeFilters.page).toBe(pageBeforeLoadMore)
  })

  it('should calculate hasMore correctly when sources have more data', async () => {
    // Mock responses with enough articles to indicate more data available
    const manyArticles = Array.from({ length: 10 }, (_, i) => ({
      id: `article-${i}`,
      title: `Article ${i}`,
      description: `Description ${i}`,
      url: `https://example.com/${i}`,
      urlToImage: null,
      publishedAt: '2024-01-01',
      author: null,
      source: { id: 'guardian', name: 'Guardian' },
      content: null,
    }))

    mockGetGuardianArticles.mockResolvedValue({
      data: { articles: manyArticles },
    })
    mockGetNYTimesArticles.mockResolvedValue({
      data: { articles: [] },
    })
    mockGetNewsApiArticles.mockResolvedValue({
      data: { articles: [] },
    })

    const { result } = renderHook(() => useNews({}))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.hasMore).toBe(true)
  })

  it('should calculate hasMore as false when no sources have more data', async () => {
    // Mock responses with fewer articles than pageSize
    mockGetGuardianArticles.mockResolvedValue({
      data: { articles: [] },
    })
    mockGetNYTimesArticles.mockResolvedValue({
      data: { articles: [] },
    })
    mockGetNewsApiArticles.mockResolvedValue({
      data: { articles: [] },
    })

    const { result } = renderHook(() => useNews({}))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.hasMore).toBe(false)
  })

  it('should call onFiltersChange callback when filters change', async () => {
    const onFiltersChange = vi.fn()
    mockGetGuardianArticles.mockResolvedValue({
      data: { articles: [] },
    })
    mockGetNYTimesArticles.mockResolvedValue({
      data: { articles: [] },
    })
    mockGetNewsApiArticles.mockResolvedValue({
      data: { articles: [] },
    })

    renderHook(() => useNews({ onFiltersChange }))

    await waitFor(() => {
      expect(onFiltersChange).toHaveBeenCalled()
    })
  })

  it('should handle empty responses', async () => {
    mockGetGuardianArticles.mockResolvedValue({
      data: { articles: [] },
    })
    mockGetNYTimesArticles.mockResolvedValue({
      data: { articles: [] },
    })
    mockGetNewsApiArticles.mockResolvedValue({
      data: { articles: [] },
    })

    const { result } = renderHook(() => useNews({}))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.items).toEqual([])
  })

  it('should not fetch when no sources are selected', () => {
    const initialFilters: Partial<NewsFilters> = {
      sources: [],
    }

    renderHook(() => useNews({ initialFilters }))

    // Should not call any APIs since no sources are selected
    expect(mockGetGuardianArticles).not.toHaveBeenCalled()
    expect(mockGetNYTimesArticles).not.toHaveBeenCalled()
    expect(mockGetNewsApiArticles).not.toHaveBeenCalled()
  })
})
