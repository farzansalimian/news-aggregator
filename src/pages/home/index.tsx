import { NewsList } from '@/features/news-list'
import type { NewsListFiltersProps } from '@/features/news-list/filters'

const filterItemsConfig: NewsListFiltersProps['filterItemsConfig'] = {
  search: true,
  author: false,
  date: true,
  sources: true,
  categories: true,
}

export const HomePage = () => {
  return <NewsList filterItemsConfig={filterItemsConfig} />
}
