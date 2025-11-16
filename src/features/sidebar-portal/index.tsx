import { SIDEBAR_ID } from '@/constants/element-ids'
import { useMount } from '@/hooks/use-mount'
import { useMemo } from 'react'
import { createPortal } from 'react-dom'

export const SidebarPortal = ({ children }: { children: React.ReactNode }) => {
  const { isMounted } = useMount()

  const target = useMemo(() => {
    if (!isMounted) return null
    return document.getElementById(SIDEBAR_ID) as HTMLElement
  }, [isMounted])

  if (!target) return null
  return createPortal(children, target)
}
