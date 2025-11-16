import type { Article, NewsFilters } from '@/types/news'

export type GetArticlesParams = NewsFilters

export interface PaginatedResponse<T> {
  articles: T[]
}

export type GetArticlesResponse = PaginatedResponse<Article>
