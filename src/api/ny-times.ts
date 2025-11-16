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

export interface NYTimesResponse {
  response: {
    docs: Array<{
      _id: string
      headline: {
        main: string
      }
      abstract: string
      web_url: string
      pub_date: string
      byline?: {
        original?: string
      }
      lead_paragraph?: string
      multimedia?: {
        caption?: string
        credit?: string
        default?: {
          height?: number
          url?: string
          width?: number
        }
        thumbnail?: {
          height?: number
          url?: string
          width?: number
        }
      }
    }>
    meta: {
      hits: number
    }
  }
}

export const transformNYTimesResponse = (
  data: NYTimesResponse,
): GetArticlesResponse => {
  const docs = data.response?.docs || []
  const articles: Article[] = docs.map(doc => ({
    id: doc._id || '',
    title: doc.headline?.main || '',
    description: doc.abstract || '',
    url: doc.web_url || '',
    urlToImage:
      doc.multimedia?.default?.url || doc.multimedia?.thumbnail?.url || null,
    publishedAt: doc.pub_date || '',
    author: doc.byline?.original || null,
    source: {
      id: 'ny-times',
      name: 'The New York Times',
    },
    content: doc.lead_paragraph || null,
  }))

  return {
    articles,
  }
}

export const buildNYTimesUrl = (params: GetArticlesParams): string => {
  const { page = 1, categories, dateFrom, dateTo, searchQuery, author } = params
  const baseUrl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json'
  const apiKey = EnvVariables.NY_TIMES_KEY

  // NY Times uses 0-based pagination
  let url = `${baseUrl}?api-key=${apiKey}&page=${page - 1}`

  if (searchQuery) {
    url += `&q=${encodeURIComponent(searchQuery)}`
  }

  if (categories && categories.length > 0) {
    url += `&fq=section_name:${encodeURIComponent(categories.join('|'))}`
  }

  if (author) {
    url += `&fq=byline:("${author}")`
  }

  if (dateFrom) {
    url += `&begin_date=${formatDate(dateFrom).replace(/-/g, '')}`
  }

  if (dateTo) {
    url += `&end_date=${formatDate(dateTo).replace(/-/g, '')}`
  }

  return url
}

export const nyTimesApi = createApi({
  reducerPath: ReducersName.NyTimesApi,
  baseQuery: fetchBaseQuery({ baseUrl: '' }),
  tagTypes: ['Articles'],
  endpoints: builder => ({
    getNYTimesArticles: builder.query<GetArticlesResponse, GetArticlesParams>({
      queryFn: async (params, _queryApi, _extraOptions, baseQuery) => {
        const url = buildNYTimesUrl(params)

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

        const transformedData = transformNYTimesResponse(
          result.data as NYTimesResponse,
        )

        return {
          data: transformedData,
        }
      },
    }),
  }),
})

export const { useGetNYTimesArticlesQuery, useLazyGetNYTimesArticlesQuery } =
  nyTimesApi
