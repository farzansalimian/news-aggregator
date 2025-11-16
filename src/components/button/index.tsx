import { cx } from '@/utils/cx'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

export const Button = ({ children, onClick, className }: ButtonProps) => {
  return (
    <button
      className={cx('bg-primary rounded-md px-4 py-2 text-white', className)}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
