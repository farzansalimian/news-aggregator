import { createPortal } from 'react-dom'
import { CloseIcon } from './close-icon'
import { cx } from '@/utils/cx'

interface ModalProps {
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
  title?: string
  footer?: React.ReactNode
  keepContentMounted?: boolean
}
export const Modal = ({
  children,
  isOpen,
  onClose,
  title,
  footer,
  keepContentMounted = true,
}: ModalProps) => {
  return createPortal(
    <div
      className={cx(
        isOpen
          ? 'pointer-events-auto opacity-100'
          : 'pointer-events-none opacity-0',
        'fixed inset-0 z-50 flex h-screen w-screen flex-col transition-opacity duration-300',
        'overflow-auto bg-white md:m-auto md:h-1/2 md:w-1/2',
        'md:rounded md:border md:border-gray-300 md:shadow',
      )}
    >
      <div
        className="text-primary sticky top-0 right-0 z-10 flex cursor-pointer items-center justify-between bg-white px-4 py-2 shadow"
        onClick={onClose}
      >
        <span className="text-lg font-bold">{title}</span>
        <CloseIcon />
      </div>
      {keepContentMounted || isOpen ? (
        <div className="grow rounded-md bg-white p-4">{children}</div>
      ) : null}
      {footer && (
        <div className="sticky bottom-0 z-10 border-t border-gray-200 bg-white p-2">
          {footer}
        </div>
      )}
    </div>,
    document.body,
  )
}
