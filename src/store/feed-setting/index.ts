import {
  createSelector,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit'
import { ReducersName } from '../constants'
import type { RootState } from '..'
import type { NewsFilters } from '@/types/news'

type FeedFilters = Partial<Omit<NewsFilters, 'page' | 'pageSize'>>

export interface FeedSettingState {
  filters: FeedFilters
}

const initialState: FeedSettingState = {
  filters: {},
}

const feedSettingSlice = createSlice({
  name: ReducersName.FeedSetting,
  initialState,
  reducers: {
    feedSettingUpdateFilters: (state, action: PayloadAction<FeedFilters>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
  },
})

export const { feedSettingUpdateFilters } = feedSettingSlice.actions
export const feedSettingReducer = feedSettingSlice.reducer

const feedSettingSelectState = (state: RootState) =>
  state[ReducersName.FeedSetting]

export const feedSettingSelectFilters = createSelector(
  [feedSettingSelectState],
  state => state.filters,
)
