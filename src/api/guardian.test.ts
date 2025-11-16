import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  transformGuardianResponse,
  buildGuardianUrl,
  type GuardianResponse,
} from './guardian'
import * as dateUtils from '@/utils/date'
import * as stripHtmlUtils from '@/utils/strip-html'

// Mock dependencies
vi.mock('@/utils/date', () => ({
  formatDate: vi.fn((date: string | Date) => {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toISOString().split('T')[0]
  }),
}))

vi.mock('@/utils/strip-html', () => ({
  stripHtml: vi.fn((html: string) => {
    // Simple mock that removes HTML tags
    return html.replace(/<[^>]*>/g, '').trim()
  }),
}))

vi.mock('@/constants/env-variables', () => ({
  EnvVariables: {
    GUARDIAN_KEY: 'test-api-key',
  },
}))

describe('transformGuardianResponse', () => {
  it('should transform Guardian response to GetArticlesResponse', () => {
    const mockGuardianResponse: GuardianResponse = {
      response: {
        status: 'ok',
        total: 2,
        results: [
          {
            id: 'test-id-1',
            webTitle: 'Test Article 1',
            webUrl: 'https://example.com/article1',
            webPublicationDate: '2024-01-01T10:00:00Z',
            fields: {
              thumbnail: 'https://example.com/image1.jpg',
              body: '<p>This is a test article body with <strong>HTML</strong> content.</p>',
            },
          },
          {
            id: 'test-id-2',
            webTitle: 'Test Article 2',
            webUrl: 'https://example.com/article2',
            webPublicationDate: '2024-01-02T11:00:00Z',
            fields: {
              thumbnail: 'https://example.com/image2.jpg',
              body: '<p>Another article body.</p>',
            },
          },
        ],
      },
    }

    const result = transformGuardianResponse(mockGuardianResponse)

    expect(result.articles).toHaveLength(2)
    expect(result.articles[0]).toEqual({
      id: 'test-id-1',
      title: 'Test Article 1',
      description: expect.stringContaining('This is a test article body'),
      url: 'https://example.com/article1',
      urlToImage: 'https://example.com/image1.jpg',
      publishedAt: '2024-01-01T10:00:00Z',
      author: null,
      source: {
        id: 'guardian',
        name: 'The Guardian',
      },
      content:
        '<p>This is a test article body with <strong>HTML</strong> content.</p>',
    })
    expect(result.articles[1].id).toBe('test-id-2')
  })

  it('should handle empty results array', () => {
    const mockGuardianResponse: GuardianResponse = {
      response: {
        status: 'ok',
        total: 0,
        results: [],
      },
    }

    const result = transformGuardianResponse(mockGuardianResponse)

    expect(result.articles).toHaveLength(0)
  })

  it('should handle missing fields', () => {
    const mockGuardianResponse: GuardianResponse = {
      response: {
        status: 'ok',
        total: 1,
        results: [
          {
            id: 'test-id',
            webTitle: 'Test Article',
            webUrl: 'https://example.com/article',
            webPublicationDate: '2024-01-01T10:00:00Z',
          },
        ],
      },
    }

    const result = transformGuardianResponse(mockGuardianResponse)

    expect(result.articles[0]).toEqual({
      id: 'test-id',
      title: 'Test Article',
      description: '',
      url: 'https://example.com/article',
      urlToImage: null,
      publishedAt: '2024-01-01T10:00:00Z',
      author: null,
      source: {
        id: 'guardian',
        name: 'The Guardian',
      },
      content: null,
    })
  })

  it('should handle missing optional fields in article', () => {
    const mockGuardianResponse: GuardianResponse = {
      response: {
        status: 'ok',
        total: 1,
        results: [
          {
            id: '',
            webTitle: '',
            webUrl: '',
            webPublicationDate: '',
            fields: {
              thumbnail: undefined,
              body: undefined,
            },
          },
        ],
      },
    }

    const result = transformGuardianResponse(mockGuardianResponse)

    expect(result.articles[0].id).toBe('')
    expect(result.articles[0].title).toBe('')
    expect(result.articles[0].url).toBe('')
    expect(result.articles[0].urlToImage).toBeNull()
    expect(result.articles[0].content).toBeNull()
  })

  it('should truncate description to 200 characters', () => {
    const longBody = '<p>' + 'a'.repeat(300) + '</p>'
    const mockGuardianResponse: GuardianResponse = {
      response: {
        status: 'ok',
        total: 1,
        results: [
          {
            id: 'test-id',
            webTitle: 'Test Article',
            webUrl: 'https://example.com/article',
            webPublicationDate: '2024-01-01T10:00:00Z',
            fields: {
              body: longBody,
            },
          },
        ],
      },
    }

    const result = transformGuardianResponse(mockGuardianResponse)

    expect(result.articles[0].description.length).toBeLessThanOrEqual(200)
  })

  it('should strip HTML from description', () => {
    const mockGuardianResponse: GuardianResponse = {
      response: {
        status: 'ok',
        total: 1,
        results: [
          {
            id: 'test-id',
            webTitle: 'Test Article',
            webUrl: 'https://example.com/article',
            webPublicationDate: '2024-01-01T10:00:00Z',
            fields: {
              body: '<p>This is <strong>bold</strong> and <em>italic</em> text.</p>',
            },
          },
        ],
      },
    }

    const result = transformGuardianResponse(mockGuardianResponse)

    expect(stripHtmlUtils.stripHtml).toHaveBeenCalled()
    expect(result.articles[0].description).not.toContain('<')
    expect(result.articles[0].description).not.toContain('>')
  })
})

describe('buildGuardianUrl', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should build URL with minimal parameters', () => {
    const url = buildGuardianUrl({ page: 1, pageSize: 10 })

    expect(url).toContain('https://content.guardianapis.com/search')
    expect(url).toContain('api-key=test-api-key')
    expect(url).toContain('page=1')
    expect(url).toContain('page-size=10')
    expect(url).toContain('show-fields=thumbnail%2Cbody')
  })

  it('should include search query in URL', () => {
    const url = buildGuardianUrl({
      page: 1,
      pageSize: 10,
      searchQuery: 'test query',
    })

    expect(url).toContain('q=test%2520query')
  })

  it('should include categories in URL', () => {
    const url = buildGuardianUrl({
      page: 1,
      pageSize: 10,
      categories: ['technology', 'science'],
    })

    expect(url).toContain('section=technology%257Cscience')
  })

  it('should include dateFrom in URL', () => {
    const dateFrom = new Date('2024-01-01')
    const url = buildGuardianUrl({ page: 1, pageSize: 10, dateFrom })

    expect(dateUtils.formatDate).toHaveBeenCalledWith(dateFrom)
    expect(url).toContain('from-date=')
  })

  it('should include dateTo in URL', () => {
    const dateTo = new Date('2024-01-31')
    const url = buildGuardianUrl({ page: 1, pageSize: 10, dateTo })

    expect(dateUtils.formatDate).toHaveBeenCalledWith(dateTo)
    expect(url).toContain('to-date=')
  })

  it('should include author in URL', () => {
    const url = buildGuardianUrl({
      page: 1,
      pageSize: 10,
      author: 'John Doe',
    })

    expect(url).toContain('tag%2Fcontributor=John%2520Doe')
  })

  it('should handle all parameters together', () => {
    const dateFrom = new Date('2024-01-01')
    const dateTo = new Date('2024-01-31')

    const url = buildGuardianUrl({
      page: 2,
      pageSize: 20,
      searchQuery: 'technology',
      categories: ['technology'],
      dateFrom,
      dateTo,
      author: 'Jane Smith',
    })

    expect(url).toContain('page=2')
    expect(url).toContain('page-size=20')
    expect(url).toContain('q=technology')
    expect(url).toContain('section=technology')
    expect(url).toContain('from-date=')
    expect(url).toContain('to-date=')
    expect(url).toContain('tag%2Fcontributor=Jane%2520Smith')
  })

  it('should use default page and pageSize values', () => {
    const url = buildGuardianUrl({} as Parameters<typeof buildGuardianUrl>[0])

    expect(url).toContain('page=1')
    expect(url).toContain('page-size=10')
  })
})
