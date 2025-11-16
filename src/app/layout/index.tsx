import { Link } from '@/components/link'
import { HEADER_NAVBAR_LEFT_SLOT_ID, SIDEBAR_ID } from '@/constants/element-ids'
import { RoutePaths } from '@/constants/routes'
import { appSetWindowSize } from '@/store/app'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useAppDispatch } from '@/hooks/store'
import { useRouterMatch } from '@/hooks/use-router-match'
import { cx } from '@/utils/cx'

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const headerRef = useRef<HTMLDivElement>(null)
  const [headerHeight, setHeaderHeight] = useState(0)

  useEffect(() => {
    if (!headerRef.current) return
    const el = headerRef.current
    const obs = new ResizeObserver(entries => {
      for (const entry of entries) {
        setHeaderHeight(entry.contentRect.height)
      }
    })

    obs.observe(el)

    return () => obs.disconnect()
  }, [])
  const dispatch = useAppDispatch()

  useLayoutEffect(() => {
    function updateSize() {
      dispatch(
        appSetWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        }),
      )
    }
    window.addEventListener('resize', updateSize)
    updateSize()
    return () => window.removeEventListener('resize', updateSize)
  }, [dispatch])

  const isFeedPage = !!useRouterMatch({ path: RoutePaths.FEED })
  const isHomePage = !!useRouterMatch({ path: RoutePaths.HOME })

  return (
    <div className="relative flex h-screen w-screen flex-col overflow-auto">
      <div
        ref={headerRef}
        className="sticky top-0 z-20 flex items-center justify-between bg-white shadow"
      >
        <nav className="flex flex-wrap items-center gap-4 p-4">
          <div id={HEADER_NAVBAR_LEFT_SLOT_ID} />
          <Link to={RoutePaths.HOME}>
            <span
              className={cx(
                'text-primary text-lg font-bold',
                isHomePage && 'text-blue-500',
              )}
            >
              Home
            </span>
          </Link>
          <Link to={RoutePaths.FEED}>
            <span
              className={cx(
                'text-primary text-lg font-bold',
                isFeedPage && 'text-blue-500',
              )}
            >
              Feed
            </span>
          </Link>
        </nav>
      </div>
      <div className="flex w-full grow items-start p-4">
        <div
          id={SIDEBAR_ID}
          className="sticky z-10"
          style={{ top: headerHeight + 16 }}
        />
        <div className="h-full grow">{children}</div>
      </div>
    </div>
  )
}
