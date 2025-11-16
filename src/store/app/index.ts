import {
  createSelector,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit'
import { ReducersName } from '../constants'
import type { RootState } from '..'

export interface AppState {
  windowSize: {
    width: number
    height: number
  }
}

const initialState: AppState = {
  windowSize: {
    width: window.innerWidth,
    height: window.innerHeight,
  },
}

const appSlice = createSlice({
  name: ReducersName.FeedSetting,
  initialState,
  reducers: {
    appSetWindowSize: (
      state,
      action: PayloadAction<AppState['windowSize']>,
    ) => {
      state.windowSize = {
        width: action.payload.width,
        height: action.payload.height,
      }
    },
  },
})

export const { appSetWindowSize } = appSlice.actions
export const appReducer = appSlice.reducer

const appSelectState = (state: RootState) => state[ReducersName.App]

export const appSelectIsMobile = createSelector(
  [appSelectState],
  state => state.windowSize.width < 768,
)
