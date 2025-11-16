import type { NewsFilters } from '@/types/news'
import { Grid } from '@/components/grid'
import { NewsListItem } from './item'
import { NewsListFilters, type NewsListFiltersProps } from './filters'
import { useNews } from './use-news'
import { SidebarPortal } from '../sidebar-portal'
import { appSelectIsMobile } from '@/store/app'
import { useAppSelector } from '@/hooks/store'
import { NavbarLeftSlotPortal } from '../navbar-lef-slot-portal'
import { FilterIcon } from './filter-icon'
import { Modal } from '@/components/modal'
import { useState } from 'react'
import { Button } from '@/components/button'

interface NewsListProps {
  initialFilters?: Partial<NewsFilters>
  onFiltersChange?: (filters: NewsFilters) => void
  filterItemsConfig?: NewsListFiltersProps['filterItemsConfig']
}

export const NewsList = ({
  initialFilters,
  onFiltersChange: onFiltersChangeParam,
  filterItemsConfig,
}: NewsListProps) => {
  const {
    items,
    isLoading,
    isLoadingMore,
    loadMore,
    hasMore,
    onFiltersChange,
    activeFilters,
  } = useNews({
    initialFilters: initialFilters,
    onFiltersChange: onFiltersChangeParam,
  })

  const isMobile = useAppSelector(appSelectIsMobile)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)

  const openFilterModal = () => {
    setIsFilterModalOpen(true)
  }
  const closeFilterModal = () => {
    setIsFilterModalOpen(false)
  }

  return (
    <div className="relative flex h-full">
      {isMobile ? (
        <NavbarLeftSlotPortal>
          <FilterIcon
            className="text-primary cursor-pointer"
            onClick={openFilterModal}
          />
        </NavbarLeftSlotPortal>
      ) : (
        <SidebarPortal>
          <NewsListFilters
            filters={activeFilters}
            onChange={onFiltersChange}
            filterItemsConfig={filterItemsConfig}
          />
        </SidebarPortal>
      )}
      <Modal
        title="Filters"
        isOpen={isFilterModalOpen}
        onClose={closeFilterModal}
        footer={
          <div className="flex justify-end gap-2">
            <Button onClick={closeFilterModal}>Apply</Button>
          </div>
        }
      >
        <NewsListFilters
          filters={activeFilters}
          onChange={onFiltersChange}
          filterItemsConfig={filterItemsConfig}
        />
      </Modal>
      <div className="grow px-4">
        <Grid
          isLoading={isLoading}
          isLoadingMore={isLoadingMore}
          items={items}
          renderItem={article => <NewsListItem article={article} />}
          onLoadMore={loadMore}
          hasMore={hasMore}
          className="h-full"
        />
      </div>
    </div>
  )
}
