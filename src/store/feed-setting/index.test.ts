import { describe, it, expect } from 'vitest'
import {
  feedSettingReducer,
  feedSettingUpdateFilters,
  feedSettingSelectFilters,
  type FeedSettingState,
} from '.'
import type { RootState } from '..'

describe('feedSettingSlice', () => {
  const initialState = { filters: {} }

  it('should return the initial state', () => {
    expect(feedSettingReducer(undefined, { type: '' })).toEqual(initialState)
  })

  it('should update filters correctly', () => {
    const previousState: FeedSettingState = { filters: { author: 'John Doe' } }
    const action = feedSettingUpdateFilters({ author: 'John Doe' })
    const nextState = feedSettingReducer(previousState, action)

    expect(nextState.filters).toEqual({
      author: 'John Doe',
    })
  })

  it('should overwrite existing filters with new values', () => {
    const previousState = { filters: { category: 'sports', author: 'Jane' } }
    const action = feedSettingUpdateFilters({ author: 'John Doe' })
    const nextState = feedSettingReducer(previousState, action)

    expect(nextState.filters).toEqual({
      category: 'sports',
      author: 'John Doe',
    })
  })

  it('selector feedSettingSelectFilters returns filters', () => {
    const mockState = {
      feedSetting: {
        filters: {
          categories: ['technology'],
          author: 'Alice',
        },
      },
    }

    const selected = feedSettingSelectFilters(mockState as RootState)
    expect(selected).toEqual({ categories: ['technology'], author: 'Alice' })
  })
})
