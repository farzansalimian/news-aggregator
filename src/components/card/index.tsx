import { cx } from '@/utils/cx'
import imagePlaceholder from './placeholder.png'
interface CardProps {
  title: string
  description: string
  imageUrl?: string | null
  className?: string
  footer?: React.ReactNode
  url: string
  topSlot?: React.ReactNode
}
export const Card = ({
  title,
  description,
  imageUrl,
  footer,
  url,
  className,
  topSlot,
}: CardProps) => {
  return (
    <a href={url} target="_blank" className="text-primary cursor-pointer">
      <div
        className={cx(
          'group text-primary flex transform flex-col overflow-hidden rounded-lg bg-white shadow-md transition duration-300 ease-in-out hover:bg-gray-100',
          className,
        )}
      >
        <img
          src={imageUrl || imagePlaceholder}
          alt={title}
          className="h-40 w-full rounded-t-lg object-cover transition duration-300 ease-in-out group-hover:scale-110"
        />
        <div className="flex grow flex-col p-4">
          <div className="line-clamp-1 text-sm text-gray-500">{topSlot}</div>
          <h3 className="text-lg font-bold">{title}</h3>
          <p className="line-clamp-3 text-sm text-gray-500">{description}</p>
          {footer && <div className="mt-auto pt-4">{footer}</div>}
        </div>
      </div>
    </a>
  )
}
