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
import { stripHtml } from '@/utils/strip-html'

export interface GuardianResponse {
  response: {
    status: string
    total: number
    results: Array<{
      id: string
      webTitle: string
      webUrl: string
      webPublicationDate: string
      fields?: {
        thumbnail?: string
        body?: string
      }
    }>
  }
}
export const transformGuardianResponse = (
  data: GuardianResponse,
): GetArticlesResponse => {
  const results = data.response?.results || []
  const articles: Article[] = results.map(article => ({
    id: article.id || '',
    title: article.webTitle || '',
    description: stripHtml(article.fields?.body || '')?.substring(0, 200) || '',
    url: article.webUrl || '',
    urlToImage: article.fields?.thumbnail || null,
    publishedAt: article.webPublicationDate || '',
    author: null, // Guardian doesn't provide author in search results
    source: {
      id: 'guardian',
      name: 'The Guardian',
    },
    content: article.fields?.body || null,
  }))

  return {
    articles,
  }
}

export const buildGuardianUrl = (params: GetArticlesParams): string => {
  const {
    page = 1,
    pageSize = 10,
    categories,
    dateFrom,
    dateTo,
    searchQuery,
    author,
  } = params
  const baseUrl = 'https://content.guardianapis.com/search'
  const apiKey = EnvVariables.GUARDIAN_KEY

  let url = `${baseUrl}?api-key=${apiKey}&page=${page}&page-size=${pageSize}&show-fields=thumbnail,body`

  if (searchQuery) {
    url += `&q=${encodeURIComponent(searchQuery)}`
  }

  if (categories) {
    url += `&section=${encodeURIComponent(categories.join('|'))}`
  }

  if (dateFrom) {
    url += `&from-date=${formatDate(dateFrom)}`
  }

  if (dateTo) {
    url += `&to-date=${formatDate(dateTo)}`
  }

  if (author) {
    url += `&tag/contributor=${encodeURIComponent(author)}`
  }

  return url
}

export const guardianApi = createApi({
  reducerPath: ReducersName.GuardianApi,
  baseQuery: fetchBaseQuery({ baseUrl: '' }),
  tagTypes: ['Articles'],
  endpoints: builder => ({
    getGuardianArticles: builder.query<GetArticlesResponse, GetArticlesParams>({
      queryFn: async (params, _queryApi, _extraOptions, baseQuery) => {
        const url = buildGuardianUrl(params)

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

        const transformedData = transformGuardianResponse(
          result.data as GuardianResponse,
        )

        return {
          data: transformedData,
        }
      },
    }),
  }),
})

export const { useGetGuardianArticlesQuery, useLazyGetGuardianArticlesQuery } =
  guardianApi
