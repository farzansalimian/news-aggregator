import { http, HttpResponse } from 'msw'
import type { GuardianResponse } from '@/api/guardian'
import type { NYTimesResponse } from '@/api/ny-times'
import type { NewsApiResponse } from '@/api/news-api'

export const handlers = [
  // Mock Guardian API
  http.get('https://content.guardianapis.com/search', ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')

    const mockResponse: GuardianResponse = {
      response: {
        status: 'ok',
        total: 100,
        results: Array.from({ length: 10 }, (_, i) => ({
          id: `guardian-${page}-${i}`,
          webTitle: `Guardian Article ${page}-${i}`,
          webUrl: `https://guardian.com/article-${page}-${i}`,
          webPublicationDate: new Date().toISOString(),
          fields: {
            thumbnail: `https://example.com/image-${i}.jpg`,
            body: `Article content ${i}`,
          },
        })),
      },
    }

    return HttpResponse.json(mockResponse)
  }),

  // Mock NY Times API
  http.get(
    'https://api.nytimes.com/svc/search/v2/articlesearch.json',
    ({ request }) => {
      const url = new URL(request.url)
      const page = parseInt(url.searchParams.get('page') || '0')

      const mockResponse: NYTimesResponse = {
        status: 'OK',
        copyright: 'Copyright',
        response: {
          docs: Array.from({ length: 10 }, (_, i) => ({
            _id: `nytimes-${page}-${i}`,
            headline: {
              main: `NY Times Article ${page}-${i}`,
            },
            abstract: `Description ${i}`,
            web_url: `https://nytimes.com/article-${page}-${i}`,
            pub_date: new Date().toISOString(),
            byline: {
              original: `By Author ${i}`,
            },
            multimedia: [
              {
                url: `https://example.com/image-${i}.jpg`,
                type: 'image',
                subtype: 'thumbnail',
              },
            ],
          })),
          meta: {
            hits: 100,
            offset: page * 10,
            time: 1,
          },
        },
      }

      return HttpResponse.json(mockResponse)
    },
  ),

  // Mock News API
  http.get('https://newsapi.org/v2/everything', ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')

    const mockResponse: NewsApiResponse = {
      status: 'ok',
      totalResults: 100,
      articles: Array.from({ length: 10 }, (_, i) => ({
        source: {
          id: 'abc-news',
          name: 'ABC News',
        },
        author: `Author ${i}`,
        title: `News API Article ${page}-${i}`,
        description: `Description ${i}`,
        url: `https://newsapi.com/article-${page}-${i}`,
        urlToImage: `https://example.com/image-${i}.jpg`,
        publishedAt: new Date().toISOString(),
        content: `Content ${i}`,
      })),
    }

    return HttpResponse.json(mockResponse)
  }),
]
