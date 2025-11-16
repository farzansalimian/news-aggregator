import { NewsList } from '@/features/news-list'
import {
  feedSettingSelectFilters,
  feedSettingUpdateFilters,
} from '@/store/feed-setting'
import { useAppDispatch, useAppSelector } from '@/hooks/store'
import { useCallback } from 'react'
import type { NewsFilters } from '@/types/news'
import type { NewsListFiltersProps } from '@/features/news-list/filters'

const filterItemsConfig: NewsListFiltersProps['filterItemsConfig'] = {
  search: false,
  author: true,
  date: true,
  sources: true,
  categories: true,
}

export const FeedPage = () => {
  const initialFilters = useAppSelector(feedSettingSelectFilters)
  const dispatch = useAppDispatch()

  const onFiltersChange = useCallback(
    (filters: NewsFilters) => {
      const { page: _page, pageSize: _pageSize, ...rest } = filters
      dispatch(feedSettingUpdateFilters(rest))
    },
    [dispatch],
  )
  return (
    <NewsList
      initialFilters={initialFilters}
      onFiltersChange={onFiltersChange}
      filterItemsConfig={filterItemsConfig}
    />
  )
}
