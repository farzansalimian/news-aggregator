import { Link } from '@/components/link'
import { RoutePaths } from '@/constants/routes'

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <nav className="flex gap-4">
        <Link to={RoutePaths.HOME}>Home</Link>
        <Link to={RoutePaths.FEED}>Feed</Link>
      </nav>
      {children}
    </div>
  )
}
