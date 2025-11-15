import { RoutePaths } from '@/constants/routes'
import { persistor, store } from '@/store'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import { BrowserRouter, Routes, Route } from 'react-router'
import { HomePage } from '@/pages/home'
import { FeedPage } from '@/pages/feed'
import { NotFoundPage } from '@/pages/not-found'
import { Layout } from './layout'

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path={RoutePaths.HOME} element={<HomePage />} />
              <Route path={RoutePaths.FEED} element={<FeedPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  )
}

export default App
