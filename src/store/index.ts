import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { ReducersName } from './constants'
import { feedSettingReducer } from './feed-setting'

import storage from 'redux-persist/lib/storage'
import { persistReducer, persistStore } from 'redux-persist'
import { appReducer } from './app'
import { guardianApi } from '@/api/guardian'
import { newsApi } from '@/api/news-api'
import { nyTimesApi } from '@/api/ny-times'

const rootReducer = combineReducers({
  [ReducersName.FeedSetting]: feedSettingReducer,
  [ReducersName.App]: appReducer,
  [ReducersName.GuardianApi]: guardianApi.reducer,
  [ReducersName.NyTimesApi]: nyTimesApi.reducer,
  [ReducersName.NewsApi]: newsApi.reducer,
})

const persistConfig = {
  key: 'root',
  storage,
  whitelist: [ReducersName.FeedSetting],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/FLUSH',
          'persist/PAUSE',
          'persist/PURGE',
          'persist/REGISTER',
        ],
      },
    }).concat(
      guardianApi.middleware,
      nyTimesApi.middleware,
      newsApi.middleware,
    ),
})
export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
