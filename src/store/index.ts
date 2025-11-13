import { configureStore } from '@reduxjs/toolkit'
import { ReducersName } from './constants'
import { feedSettingReducer } from './feed-setting'

export const store = configureStore({
  reducer: {
    [ReducersName.FeedSetting]: feedSettingReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
