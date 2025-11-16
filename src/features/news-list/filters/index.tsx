import type { NewsFilters } from '@/types/news'
import { Filters } from '@/components/filters'
import type { FilterItemProps } from '@/components/filters/item'
import { CATEGORIES_OPTIONS, SOURCES_OPTIONS } from '../constants'
import { useMemo } from 'react'

export interface NewsListFiltersProps {
  filters: NewsFilters
  onChange: (filters: Partial<NewsFilters>) => void
  filterItemsConfig?: {
    search: boolean
    author: boolean
    date: boolean
    sources: boolean
    categories: boolean
  }
}

const DEFAULT_FILTER_ITEMS_CONFIG = {
  search: true,
  author: true,
  date: true,
  sources: true,
  categories: true,
}
export const NewsListFilters = ({
  filters,
  onChange,
  filterItemsConfig = DEFAULT_FILTER_ITEMS_CONFIG,
}: NewsListFiltersProps) => {
  const filterItems: FilterItemProps[] = useMemo(() => {
    const items: FilterItemProps[] = []
    if (filterItemsConfig.search) {
      items.push({
        type: 'text',
        value: filters.searchQuery || '',
        onChange: (value: string) => onChange({ searchQuery: value }),
        title: 'Search by keyword',
      })
    }
    if (filterItemsConfig.author) {
      items.push({
        type: 'text',
        title: 'Author',
        value: filters.author || '',
        onChange: (value: string) => onChange({ author: value }),
      })
    }
    if (filterItemsConfig.date) {
      items.push({
        type: 'date',
        title: 'Date range',
        startDate: filters.dateFrom,
        endDate: filters.dateTo,
        onChange: (dates: [Date | null, Date | null]) =>
          onChange({ dateFrom: dates[0], dateTo: dates[1] }),
      })
    }
    if (filterItemsConfig.sources) {
      items.push(
        ...SOURCES_OPTIONS.map((source, index) => ({
          title: index === 0 ? 'Sources' : '',
          type: 'checkbox' as const,
          checked: filters.sources?.includes(source.id) || false,
          onChange: (checked: boolean) =>
            onChange({
              sources: checked
                ? [...(filters.sources || []), source.id]
                : filters.sources?.filter(s => s !== source.id),
            }),
          label: source.name,
        })),
      )
    }
    if (filterItemsConfig.categories) {
      items.push(
        ...CATEGORIES_OPTIONS.map((category, index) => ({
          title: index === 0 ? 'Categories' : '',
          type: 'checkbox' as const,
          checked: filters.categories?.includes(category.id) || false,
          onChange: (checked: boolean) =>
            onChange({
              categories: checked
                ? [...(filters.categories || []), category.id]
                : filters.categories?.filter(c => c !== category.id),
            }),
          label: category.name,
        })),
      )
    }
    return items
  }, [filters, onChange, filterItemsConfig])

  return (
    <div className="rounded-md bg-gray-100 p-4 shadow md:w-[270px]">
      <Filters items={filterItems} />
    </div>
  )
}
