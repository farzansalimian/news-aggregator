import { Link } from '@/components/link'
import { RoutePaths } from '@/constants/routes'

export const NotFoundPage = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold text-gray-700">Page Not Found</h1>
      <div className="rounded border border-gray-300 bg-gray-200 p-3 text-lg font-bold transition duration-300 ease-in-out hover:scale-110 hover:border-blue-500 hover:text-blue-500">
        <Link to={RoutePaths.HOME}>Back to Home</Link>
      </div>
    </div>
  )
}
