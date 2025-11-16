export const SOURCES_IDS = {
  GUARDIAN: 'guardian',
  NY_TIMES: 'ny-times',
  NEWS_API: 'news-api',
} as const

export const SOURCES_OPTIONS = [
  {
    id: SOURCES_IDS.GUARDIAN,
    name: 'Guardian',
  },
  {
    id: SOURCES_IDS.NY_TIMES,
    name: 'NY Times',
  },
  {
    id: SOURCES_IDS.NEWS_API,
    name: 'News',
  },
] as const

export const CATEGORIES_OPTIONS = [
  {
    id: 'technology',
    name: 'Technology',
  },
  {
    id: 'science',
    name: 'Science',
  },
  {
    id: 'business',
    name: 'Business',
  },
  {
    id: 'health',
    name: 'Health',
  },
] as const
