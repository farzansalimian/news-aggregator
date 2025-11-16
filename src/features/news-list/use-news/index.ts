import { useLazyGetGuardianArticlesQuery } from '@/api/guardian'
import { useLazyGetNYTimesArticlesQuery } from '@/api/ny-times'
import type { Article, NewsFilters } from '@/types/news'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDebounce } from '@/hooks/use-debounce'
import { useLazyGetNewsApiArticlesQuery } from '@/api/news-api'
import { SOURCES_IDS } from '../constants'

interface Props {
  initialFilters?: Partial<NewsFilters>
  onFiltersChange?: (filters: NewsFilters) => void
}

const PAGE_SIZE = 10

export const useNews = ({
  initialFilters,
  onFiltersChange: onFiltersChangeParam,
}: Props) => {
  const [activeFilters, setActiveFilters] = useState<NewsFilters>({
    sources: [SOURCES_IDS.GUARDIAN, SOURCES_IDS.NY_TIMES, SOURCES_IDS.NEWS_API],
    page: 1,
    pageSize: PAGE_SIZE,
    ...(initialFilters || {}),
  })

  const debouncedFilters = useDebounce(activeFilters, 500)
  const resourcesHasMore = useRef<
    Record<(typeof SOURCES_IDS)[keyof typeof SOURCES_IDS], boolean>
  >({
    [SOURCES_IDS.GUARDIAN]: true,
    [SOURCES_IDS.NY_TIMES]: true,
    [SOURCES_IDS.NEWS_API]: true,
  })

  const [data, setData] = useState<
    Record<
      (typeof SOURCES_IDS)[keyof typeof SOURCES_IDS],
      Record<number, Article[]>
    >
  >({
    [SOURCES_IDS.GUARDIAN]: {},
    [SOURCES_IDS.NY_TIMES]: {},
    [SOURCES_IDS.NEWS_API]: {},
  })

  const [getGuardianArticles] = useLazyGetGuardianArticlesQuery()
  const [getNYTimesArticles] = useLazyGetNYTimesArticlesQuery()
  const [getNewsApiArticles] = useLazyGetNewsApiArticlesQuery()

  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  useEffect(() => {
    const promises = [
      {
        source: SOURCES_IDS.GUARDIAN,
        api: getGuardianArticles,
      },
      {
        source: SOURCES_IDS.NY_TIMES,
        api: getNYTimesArticles,
      },
      {
        source: SOURCES_IDS.NEWS_API,
        api: getNewsApiArticles,
      },
    ]
    const filteredPromises = promises.filter(
      p =>
        debouncedFilters.sources?.includes(p.source) &&
        resourcesHasMore.current[p.source],
    )

    if (filteredPromises.length === 0) {
      setIsLoading(false)
      setIsLoadingMore(false)
      return
    }

    setIsLoading(true)
    Promise.all(filteredPromises.map(p => p.api(debouncedFilters)))
      .then(data => {
        setData(prev => {
          const isFirstPage = debouncedFilters.page === 1
          const newData: Record<
            (typeof SOURCES_IDS)[keyof typeof SOURCES_IDS],
            Record<number, Article[]>
          > = {
            [SOURCES_IDS.GUARDIAN]: {},
            [SOURCES_IDS.NY_TIMES]: {},
            [SOURCES_IDS.NEWS_API]: {},
          }
          data.forEach((item, index) => {
            resourcesHasMore.current = {
              ...resourcesHasMore.current,
              [filteredPromises[index].source]:
                (item.data?.articles?.length || 0) >= debouncedFilters.pageSize,
            }

            newData[filteredPromises[index].source] = {
              [debouncedFilters.page]: item.data?.articles || [],
              ...(isFirstPage
                ? {}
                : {
                    ...(prev[filteredPromises[index].source] || {}),
                  }),
            }
          })

          return newData
        })
      })
      .finally(() => {
        setIsLoading(false)
        setIsLoadingMore(false)
      })
  }, [
    debouncedFilters,
    getGuardianArticles,
    getNYTimesArticles,
    getNewsApiArticles,
  ])

  useEffect(() => {
    onFiltersChangeParam?.(activeFilters)
  }, [activeFilters, onFiltersChangeParam])

  const hasMore =
    debouncedFilters.sources &&
    debouncedFilters.sources.length > 0 &&
    // eslint-disable-next-line react-hooks/refs
    debouncedFilters.sources.some(source => resourcesHasMore.current[source])

  const loadMore = useCallback(() => {
    if (isLoading || isLoadingMore || !hasMore) {
      return
    }
    setIsLoadingMore(true)
    setActiveFilters(prev => ({ ...prev, page: prev.page + 1 }))
  }, [isLoading, isLoadingMore, hasMore])

  const items = useMemo(() => {
    return Object.values(data || {})
      .map(source => Object.values(source).flat())
      .flat()
  }, [data])

  const onFiltersChange = useCallback((filters: Partial<NewsFilters>) => {
    resourcesHasMore.current = {
      [SOURCES_IDS.GUARDIAN]: true,
      [SOURCES_IDS.NY_TIMES]: true,
      [SOURCES_IDS.NEWS_API]: true,
    }
    setIsLoading(true)
    setData({
      [SOURCES_IDS.GUARDIAN]: {},
      [SOURCES_IDS.NY_TIMES]: {},
      [SOURCES_IDS.NEWS_API]: {},
    })
    setActiveFilters(prev => ({ ...prev, ...filters, page: 1 }))
  }, [])

  return {
    hasMore,
    data,
    items,
    isLoading: isLoading && !isLoadingMore,
    isLoadingMore: isLoadingMore && !isLoading,
    loadMore,
    onFiltersChange,
    activeFilters,
  }
}
