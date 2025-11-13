import { configureStore } from '@reduxjs/toolkit'
import { ReducersName } from './constants'
import { feedSettingReducer } from './feed-setting'
import { newsApi } from '@/api/news'

export const store = configureStore({
  reducer: {
    [ReducersName.FeedSetting]: feedSettingReducer,
    [newsApi.reducerPath]: newsApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(newsApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
