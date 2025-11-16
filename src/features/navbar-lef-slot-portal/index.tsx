import { HEADER_NAVBAR_LEFT_SLOT_ID } from '@/constants/element-ids'
import { useMount } from '@/hooks/use-mount'
import { useMemo } from 'react'
import { createPortal } from 'react-dom'

export const NavbarLeftSlotPortal = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { isMounted } = useMount()

  const target = useMemo(() => {
    if (!isMounted) return null
    return document.getElementById(HEADER_NAVBAR_LEFT_SLOT_ID) as HTMLElement
  }, [isMounted])

  if (!target) return null
  return createPortal(children, target)
}
