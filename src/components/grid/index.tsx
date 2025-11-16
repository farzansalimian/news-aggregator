import { useEffect, useRef } from 'react'
import { cx } from '@/utils/cx'
import { Spinner } from '../spinner'

interface GridProps<T> {
  items: T[]
  renderItem: (item: T) => React.ReactNode
  className?: string
  isLoading?: boolean
  isLoadingMore?: boolean
  hasMore?: boolean
  onLoadMore?: () => void
  itemKey?: keyof T
}

export const Grid = <T,>({
  items,
  renderItem,
  className,
  isLoading = false,
  isLoadingMore = false,
  hasMore = false,
  onLoadMore,
  itemKey = 'id' as keyof T,
}: GridProps<T>) => {
  const loadMoreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sentinel = loadMoreRef.current
    if (!sentinel || !hasMore || !onLoadMore || isLoading || isLoadingMore) {
      return
    }

    const observer = new IntersectionObserver(
      entries => {
        const [entry] = entries
        if (entry.isIntersecting && hasMore && !isLoading && !isLoadingMore) {
          onLoadMore()
        }
      },
      {
        rootMargin: '100px',
      },
    )

    observer.observe(sentinel)

    return () => {
      observer.disconnect()
    }
  }, [hasMore, onLoadMore, isLoading, isLoadingMore])

  return (
    <div
      className={cx(
        'relative grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        className,
      )}
    >
      {!isLoading && !isLoadingMore && items.length === 0 && (
        <div className="col-span-full flex items-center justify-center">
          <p className="text-gray-500">No more items</p>
        </div>
      )}
      {!isLoading &&
        items.map((item, index) => (
          <div key={(item[itemKey] as string) || index}>{renderItem(item)}</div>
        ))}
      {isLoading && (
        <div className="col-span-full flex items-center justify-center">
          <Spinner />
        </div>
      )}
      {isLoadingMore && (
        <div className="absolute right-0 bottom-0 left-0 mx-auto flex h-fit w-fit items-center justify-center">
          <Spinner />
        </div>
      )}
      <div className="h-1">
        {hasMore && <div ref={loadMoreRef} className="col-span-full"></div>}
      </div>
    </div>
  )
}
