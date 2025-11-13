import { RoutePaths } from '@/constants/routes'
import { store } from '@/store'
import { Provider } from 'react-redux'
import { BrowserRouter, Routes, Route } from 'react-router'
import { HomePage } from '@/pages/home'
import { FeedPage } from '@/pages/feed'
import { NotFoundPage } from '@/pages/not-found'
import { Layout } from './layout'

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path={RoutePaths.HOME} element={<HomePage />} />
            <Route path={RoutePaths.FEED} element={<FeedPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </Provider>
  )
}

export default App
