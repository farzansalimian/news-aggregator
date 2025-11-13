import {
  createSelector,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit'
import { ReducersName } from './constants'
import type { RootState } from '.'

export interface FeedSettingState {
  sources: {
    id: string
    name: string
  }[]
}

const initialState: FeedSettingState = {
  sources: [],
}

const feedSettingSlice = createSlice({
  name: ReducersName.FeedSetting,
  initialState,
  reducers: {
    feedSettingAddSource: (
      state,
      action: PayloadAction<{ id: string; name: string }>,
    ) => {
      state.sources.push(action.payload)
    },
  },
})

export const { feedSettingAddSource } = feedSettingSlice.actions
export const feedSettingReducer = feedSettingSlice.reducer

const feedSettingSelectState = (state: RootState) =>
  state[ReducersName.FeedSetting]

export const feedSettingSelectSources = createSelector(
  [feedSettingSelectState],
  state => state.sources,
)
