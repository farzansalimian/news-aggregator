import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  transformNewsApiResponse,
  buildNewsApiUrl,
  type NewsApiResponse,
} from './news-api'
import * as dateUtils from '@/utils/date'

// Mock dependencies
vi.mock('@/utils/date', () => ({
  formatDate: vi.fn((date: string | Date) => {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toISOString().split('T')[0]
  }),
}))

vi.mock('@/constants/env-variables', () => ({
  EnvVariables: {
    NEWS_API_KEY: 'test-api-key',
  },
}))

describe('transformNewsApiResponse', () => {
  it('should transform NewsApi response to GetArticlesResponse', () => {
    const mockNewsApiResponse: NewsApiResponse = {
      status: 'ok',
      totalResults: 2,
      articles: [
        {
          source: {
            id: 'abc-news',
            name: 'ABC News',
          },
          author: 'John Doe',
          title: 'Test Article 1',
          description: 'Test description 1',
          url: 'https://example.com/article1',
          urlToImage: 'https://example.com/image1.jpg',
          publishedAt: '2024-01-01T10:00:00Z',
          content: 'Full content of article 1',
        },
        {
          source: {
            id: 'bbc-news',
            name: 'BBC News',
          },
          author: 'Jane Smith',
          title: 'Test Article 2',
          description: 'Test description 2',
          url: 'https://example.com/article2',
          urlToImage: 'https://example.com/image2.jpg',
          publishedAt: '2024-01-02T11:00:00Z',
          content: 'Full content of article 2',
        },
      ],
    }

    const result = transformNewsApiResponse(mockNewsApiResponse)

    expect(result.articles).toHaveLength(2)
    expect(result.articles[0]).toEqual({
      id: 'https://example.com/article1',
      title: 'Test Article 1',
      description: 'Test description 1',
      url: 'https://example.com/article1',
      urlToImage: 'https://example.com/image1.jpg',
      publishedAt: '2024-01-01T10:00:00Z',
      author: 'John Doe',
      source: {
        id: 'abc-news',
        name: 'ABC News',
      },
      content: 'Full content of article 1',
    })
    expect(result.articles[1].id).toBe('https://example.com/article2')
  })

  it('should handle empty articles array', () => {
    const mockNewsApiResponse: NewsApiResponse = {
      status: 'ok',
      totalResults: 0,
      articles: [],
    }

    const result = transformNewsApiResponse(mockNewsApiResponse)

    expect(result.articles).toHaveLength(0)
  })

  it('should handle missing optional fields', () => {
    const mockNewsApiResponse: NewsApiResponse = {
      status: 'ok',
      totalResults: 1,
      articles: [
        {
          source: {
            id: null,
            name: 'Unknown Source',
          },
          author: null,
          title: '',
          description: '',
          url: '',
          urlToImage: null,
          publishedAt: '',
          content: null,
        },
      ],
    }

    const result = transformNewsApiResponse(mockNewsApiResponse)

    expect(result.articles[0]).toEqual({
      id: expect.any(String), // Generated ID when url is empty
      title: '',
      description: '',
      url: '',
      urlToImage: null,
      publishedAt: '',
      author: null,
      source: {
        id: null,
        name: 'Unknown Source',
      },
      content: null,
    })
  })

  it('should generate ID when url is missing', () => {
    const mockNewsApiResponse: NewsApiResponse = {
      status: 'ok',
      totalResults: 1,
      articles: [
        {
          source: {
            id: 'test',
            name: 'Test Source',
          },
          author: 'Test Author',
          title: 'Test Title',
          description: 'Test Description',
          url: '',
          urlToImage: null,
          publishedAt: '2024-01-01T10:00:00Z',
          content: null,
        },
      ],
    }

    const result = transformNewsApiResponse(mockNewsApiResponse)

    expect(result.articles[0].id).toBeTruthy()
    expect(result.articles[0].id).toMatch(/\d+-\d+\.\d+/)
  })

  it('should handle missing source name', () => {
    const mockNewsApiResponse: NewsApiResponse = {
      status: 'ok',
      totalResults: 1,
      articles: [
        {
          source: {
            id: 'test',
            name: '',
          },
          author: null,
          title: 'Test Title',
          description: 'Test Description',
          url: 'https://example.com/article',
          urlToImage: null,
          publishedAt: '2024-01-01T10:00:00Z',
          content: null,
        },
      ],
    }

    const result = transformNewsApiResponse(mockNewsApiResponse)

    expect(result.articles[0].source.name).toBe('Unknown')
  })

  it('should handle null articles array', () => {
    const mockNewsApiResponse = {
      status: 'ok',
      totalResults: 0,
      articles: null,
    } as unknown as NewsApiResponse

    const result = transformNewsApiResponse(mockNewsApiResponse)

    expect(result.articles).toHaveLength(0)
  })
})

describe('buildNewsApiUrl', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should build URL with minimal parameters', () => {
    const url = buildNewsApiUrl({ page: 1, pageSize: 10 })

    expect(url).toContain('https://newsapi.org/v2/top-headlines')
    expect(url).toContain('apiKey=test-api-key')
    expect(url).toContain('page=1')
    expect(url).toContain('pageSize=10')
  })

  it('should include search query in URL', () => {
    const url = buildNewsApiUrl({
      page: 1,
      pageSize: 10,
      searchQuery: 'test query',
    })

    expect(url).toContain('q=test%2520query')
  })

  it('should include categories in URL', () => {
    const url = buildNewsApiUrl({
      page: 1,
      pageSize: 10,
      categories: ['technology', 'science'],
    })

    expect(url).toContain('category=technology%257Cscience')
  })

  it('should include author in URL', () => {
    const url = buildNewsApiUrl({
      page: 1,
      pageSize: 10,
      author: 'John Doe',
    })

    expect(url).toContain('q=John%2520Doe')
  })

  it('should include dateFrom in URL', () => {
    const dateFrom = new Date('2024-01-01')
    const url = buildNewsApiUrl({ page: 1, pageSize: 10, dateFrom })

    expect(dateUtils.formatDate).toHaveBeenCalledWith(dateFrom)
    expect(url).toContain('from=')
  })

  it('should include dateTo in URL', () => {
    const dateTo = new Date('2024-01-31')
    const url = buildNewsApiUrl({ page: 1, pageSize: 10, dateTo })

    expect(dateUtils.formatDate).toHaveBeenCalledWith(dateTo)
    expect(url).toContain('to=')
  })

  it('should handle all parameters together', () => {
    const dateFrom = new Date('2024-01-01')
    const dateTo = new Date('2024-01-31')

    const url = buildNewsApiUrl({
      page: 2,
      pageSize: 20,
      searchQuery: 'technology',
      categories: ['technology'],
      dateFrom,
      dateTo,
      author: 'Jane Smith',
    })

    expect(url).toContain('page=2')
    expect(url).toContain('pageSize=20')
    // NewsAPI combines searchQuery and author into a single q parameter
    expect(url).toContain('q=technology%2520Jane%2520Smith')
    expect(url).toContain('category=technology')
    expect(url).toContain('from=')
    expect(url).toContain('to=')
  })

  it('should use default page and pageSize values', () => {
    const url = buildNewsApiUrl({} as Parameters<typeof buildNewsApiUrl>[0])

    expect(url).toContain('page=1')
    expect(url).toContain('pageSize=10')
  })

  it('should always include sources parameter', () => {
    const url = buildNewsApiUrl({ page: 1, pageSize: 10 })

    // News API top-headlines doesn't require sources parameter
    expect(url).toContain('https://newsapi.org/v2/top-headlines')
  })
})
