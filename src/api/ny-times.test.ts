import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  transformNYTimesResponse,
  buildNYTimesUrl,
  type NYTimesResponse,
} from './ny-times'
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
    NY_TIMES_KEY: 'test-api-key',
  },
}))

describe('transformNYTimesResponse', () => {
  it('should transform NYTimes response to GetArticlesResponse', () => {
    const mockNYTimesResponse: NYTimesResponse = {
      response: {
        docs: [
          {
            _id: 'test-id-1',
            headline: {
              main: 'Test Article 1',
            },
            abstract: 'Test abstract 1',
            web_url: 'https://example.com/article1',
            pub_date: '2024-01-01T10:00:00Z',
            byline: {
              original: 'By John Doe',
            },
            lead_paragraph: 'Full content of article 1',
            multimedia: {
              default: {
                url: 'https://example.com/image1.jpg',
                height: 100,
                width: 200,
              },
            },
          },
          {
            _id: 'test-id-2',
            headline: {
              main: 'Test Article 2',
            },
            abstract: 'Test abstract 2',
            web_url: 'https://example.com/article2',
            pub_date: '2024-01-02T11:00:00Z',
            byline: {
              original: 'By Jane Smith',
            },
            lead_paragraph: 'Full content of article 2',
            multimedia: {
              thumbnail: {
                url: 'https://example.com/image2.jpg',
                height: 50,
                width: 100,
              },
            },
          },
        ],
        meta: {
          hits: 2,
        },
      },
    }

    const result = transformNYTimesResponse(mockNYTimesResponse)

    expect(result.articles).toHaveLength(2)
    expect(result.articles[0]).toEqual({
      id: 'test-id-1',
      title: 'Test Article 1',
      description: 'Test abstract 1',
      url: 'https://example.com/article1',
      urlToImage: 'https://example.com/image1.jpg',
      publishedAt: '2024-01-01T10:00:00Z',
      author: 'By John Doe',
      source: {
        id: 'ny-times',
        name: 'The New York Times',
      },
      content: 'Full content of article 1',
    })
    expect(result.articles[1].id).toBe('test-id-2')
    expect(result.articles[1].urlToImage).toBe('https://example.com/image2.jpg')
  })

  it('should handle empty docs array', () => {
    const mockNYTimesResponse: NYTimesResponse = {
      response: {
        docs: [],
        meta: {
          hits: 0,
        },
      },
    }

    const result = transformNYTimesResponse(mockNYTimesResponse)

    expect(result.articles).toHaveLength(0)
  })

  it('should handle missing optional fields', () => {
    const mockNYTimesResponse: NYTimesResponse = {
      response: {
        docs: [
          {
            _id: 'test-id',
            headline: {
              main: '',
            },
            abstract: '',
            web_url: '',
            pub_date: '',
            byline: undefined,
            lead_paragraph: undefined,
            multimedia: undefined,
          },
        ],
        meta: {
          hits: 1,
        },
      },
    }

    const result = transformNYTimesResponse(mockNYTimesResponse)

    expect(result.articles[0]).toEqual({
      id: 'test-id',
      title: '',
      description: '',
      url: '',
      urlToImage: null,
      publishedAt: '',
      author: null,
      source: {
        id: 'ny-times',
        name: 'The New York Times',
      },
      content: null,
    })
  })

  it('should prefer default image over thumbnail', () => {
    const mockNYTimesResponse: NYTimesResponse = {
      response: {
        docs: [
          {
            _id: 'test-id',
            headline: {
              main: 'Test Article',
            },
            abstract: 'Test abstract',
            web_url: 'https://example.com/article',
            pub_date: '2024-01-01T10:00:00Z',
            byline: undefined,
            lead_paragraph: undefined,
            multimedia: {
              default: {
                url: 'https://example.com/default.jpg',
                height: 100,
                width: 200,
              },
              thumbnail: {
                url: 'https://example.com/thumb.jpg',
                height: 50,
                width: 100,
              },
            },
          },
        ],
        meta: {
          hits: 1,
        },
      },
    }

    const result = transformNYTimesResponse(mockNYTimesResponse)

    expect(result.articles[0].urlToImage).toBe(
      'https://example.com/default.jpg',
    )
  })

  it('should use thumbnail when default is not available', () => {
    const mockNYTimesResponse: NYTimesResponse = {
      response: {
        docs: [
          {
            _id: 'test-id',
            headline: {
              main: 'Test Article',
            },
            abstract: 'Test abstract',
            web_url: 'https://example.com/article',
            pub_date: '2024-01-01T10:00:00Z',
            byline: undefined,
            lead_paragraph: undefined,
            multimedia: {
              thumbnail: {
                url: 'https://example.com/thumb.jpg',
                height: 50,
                width: 100,
              },
            },
          },
        ],
        meta: {
          hits: 1,
        },
      },
    }

    const result = transformNYTimesResponse(mockNYTimesResponse)

    expect(result.articles[0].urlToImage).toBe('https://example.com/thumb.jpg')
  })

  it('should handle missing response.docs', () => {
    const mockNYTimesResponse = {
      response: {
        meta: {
          hits: 0,
        },
      },
    } as unknown as NYTimesResponse

    const result = transformNYTimesResponse(mockNYTimesResponse)

    expect(result.articles).toHaveLength(0)
  })
})

describe('buildNYTimesUrl', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should build URL with minimal parameters', () => {
    const url = buildNYTimesUrl({ page: 1, pageSize: 10 })

    expect(url).toContain(
      'https://api.nytimes.com/svc/search/v2/articlesearch.json',
    )
    expect(url).toContain('api-key=test-api-key')
    expect(url).toContain('page=0') // 0-based pagination
  })

  it('should include search query in URL', () => {
    const url = buildNYTimesUrl({
      page: 1,
      pageSize: 10,
      searchQuery: 'test query',
    })

    expect(url).toContain('q=test%20query')
  })

  it('should include categories in URL', () => {
    const url = buildNYTimesUrl({
      page: 1,
      pageSize: 10,
      categories: ['technology', 'science'],
    })

    expect(url).toContain('fq=section_name:technology%7Cscience')
  })

  it('should not include categories when array is empty', () => {
    const url = buildNYTimesUrl({
      page: 1,
      pageSize: 10,
      categories: [],
    })

    expect(url).not.toContain('fq=section_name')
  })

  it('should include author in URL', () => {
    const url = buildNYTimesUrl({
      page: 1,
      pageSize: 10,
      author: 'John Doe',
    })

    expect(url).toContain('fq=byline:("John Doe")')
  })

  it('should include dateFrom in URL with formatted date', () => {
    const dateFrom = new Date('2024-01-01')
    const url = buildNYTimesUrl({ page: 1, pageSize: 10, dateFrom })

    expect(dateUtils.formatDate).toHaveBeenCalledWith(dateFrom)
    expect(url).toContain('begin_date=')
    // Date should be formatted without dashes
    const beginDateMatch = url.match(/begin_date=(\d+)/)
    expect(beginDateMatch).toBeTruthy()
    expect(beginDateMatch?.[1]).toBe('20240101')
  })

  it('should include dateTo in URL with formatted date', () => {
    const dateTo = new Date('2024-01-31')
    const url = buildNYTimesUrl({ page: 1, pageSize: 10, dateTo })

    expect(dateUtils.formatDate).toHaveBeenCalledWith(dateTo)
    expect(url).toContain('end_date=')
    // Date should be formatted without dashes
    const endDateMatch = url.match(/end_date=(\d+)/)
    expect(endDateMatch).toBeTruthy()
    expect(endDateMatch?.[1]).toBe('20240131')
  })

  it('should handle all parameters together', () => {
    const dateFrom = new Date('2024-01-01')
    const dateTo = new Date('2024-01-31')

    const url = buildNYTimesUrl({
      page: 2,
      pageSize: 20,
      searchQuery: 'technology',
      categories: ['technology'],
      dateFrom,
      dateTo,
      author: 'Jane Smith',
    })

    expect(url).toContain('page=1') // 0-based pagination (page 2 - 1)
    expect(url).toContain('q=technology')
    expect(url).toContain('fq=section_name:technology')
    expect(url).toContain('fq=byline:("Jane Smith")')
    expect(url).toContain('begin_date=')
    expect(url).toContain('end_date=')
  })

  it('should use default page value and convert to 0-based', () => {
    const url = buildNYTimesUrl({} as Parameters<typeof buildNYTimesUrl>[0])

    expect(url).toContain('page=0') // Default page 1 - 1 = 0
  })

  it('should correctly convert page to 0-based pagination', () => {
    const url1 = buildNYTimesUrl({ page: 1, pageSize: 10 })
    const url2 = buildNYTimesUrl({ page: 2, pageSize: 10 })
    const url3 = buildNYTimesUrl({ page: 3, pageSize: 10 })

    expect(url1).toContain('page=0')
    expect(url2).toContain('page=1')
    expect(url3).toContain('page=2')
  })
})
