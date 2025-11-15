import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { ReducersName } from './constants'
import { feedSettingReducer } from './feed-setting'
import { newsApi } from '@/api/news'

import storage from 'redux-persist/lib/storage'
import { persistReducer, persistStore } from 'redux-persist'

const rootReducer = combineReducers({
  [ReducersName.FeedSetting]: feedSettingReducer,
  [newsApi.reducerPath]: newsApi.reducer,
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
    }).concat(newsApi.middleware),
})
export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
