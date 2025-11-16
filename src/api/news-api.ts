import {
  createApi,
  fetchBaseQuery,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'
import { ReducersName } from '@/store/constants'
import type { Article } from '@/types/news'
import { EnvVariables } from '@/constants/env-variables'
import { formatDate } from '@/utils/date'
import type { GetArticlesResponse } from './types'
import type { GetArticlesParams } from './types'

export interface NewsApiResponse {
  status: string
  totalResults: number
  articles: Array<{
    source: {
      id: string | null
      name: string
    }
    author: string | null
    title: string
    description: string
    url: string
    urlToImage: string | null
    publishedAt: string
    content: string | null
  }>
}

export const transformNewsApiResponse = (
  data: NewsApiResponse,
): GetArticlesResponse => {
  const articles: Article[] = (data.articles || []).map(article => ({
    id: article.url || `${Date.now()}-${Math.random()}`,
    title: article.title || '',
    description: article.description || '',
    url: article.url || '',
    urlToImage: article.urlToImage || null,
    publishedAt: article.publishedAt || '',
    author: article.author || null,
    source: {
      id: article.source?.id || null,
      name: article.source?.name || 'Unknown',
    },
    content: article.content || null,
  }))

  return {
    articles,
  }
}

export const buildNewsApiUrl = (params: GetArticlesParams): string => {
  const {
    page = 1,
    pageSize = 10,
    categories,
    author,
    dateFrom,
    dateTo,
    searchQuery,
  } = params
  const baseUrl = 'https://newsapi.org/v2'
  const apiKey = EnvVariables.NEWS_API_KEY

  let url = `${baseUrl}/everything?apiKey=${apiKey}&page=${page}&pageSize=${pageSize}`

  if (searchQuery) {
    url += `&q=${encodeURIComponent(searchQuery)}`
  }

  url += `&sources=abc-news`

  if (categories) {
    url += `&q=${encodeURIComponent(categories.join('|'))}`
  }

  if (author) {
    url += `&q=${encodeURIComponent(author)}`
  }

  if (dateFrom) {
    url += `&from=${formatDate(dateFrom)}`
  }

  if (dateTo) {
    url += `&to=${formatDate(dateTo)}`
  }

  return url
}
export const newsApi = createApi({
  reducerPath: ReducersName.NewsApi,
  baseQuery: fetchBaseQuery({ baseUrl: '' }),
  tagTypes: ['Articles'],
  endpoints: builder => ({
    getNewsApiArticles: builder.query<GetArticlesResponse, GetArticlesParams>({
      queryFn: async (params, _queryApi, _extraOptions, baseQuery) => {
        const url = buildNewsApiUrl(params)

        const result = await baseQuery(url)
        if (result.error) {
          return { error: result.error }
        }

        if (!result.data) {
          const error: FetchBaseQueryError = {
            status: 'FETCH_ERROR',
            error: 'No data returned from API',
          }
          return { error }
        }

        const transformedData = transformNewsApiResponse(
          result.data as NewsApiResponse,
        )

        return {
          data: transformedData,
        }
      },
    }),
  }),
})

export const { useGetNewsApiArticlesQuery, useLazyGetNewsApiArticlesQuery } =
  newsApi
