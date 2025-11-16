import { Card } from '@/components/card'
import type { Article } from '@/types/news'
import { formatDate } from '@/utils/date'

interface NewsListItemProps {
  article: Article
}
export const NewsListItem = ({ article }: NewsListItemProps) => {
  return (
    <Card
      title={article.title}
      description={article.description}
      imageUrl={article.urlToImage}
      footer={
        <div className="flex items-center justify-between gap-2 text-sm text-gray-500">
          <span className="truncate">{article.source.name}</span>
          <span className="truncate">{formatDate(article.publishedAt)}</span>
        </div>
      }
      className="h-full"
      url={article.url}
      topSlot={<div>{article.author || `By ${article.source.name}`}</div>}
    />
  )
}
