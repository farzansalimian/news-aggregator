type NewsSource = 'news-api' | 'guardian' | 'ny-times'

type NewsCategory = 'technology' | 'science' | 'business' | 'health'

export interface Article {
  id: string
  title: string
  description: string
  url: string
  urlToImage: string | null
  publishedAt: string
  author: string | null
  source: {
    id: string | null
    name: string
  }
  content: string | null
}

export interface NewsFilters {
  sources?: NewsSource[]
  categories?: NewsCategory[]
  author?: string
  dateFrom?: Date | null
  dateTo?: Date | null
  searchQuery?: string
  page: number
  pageSize: number
}
